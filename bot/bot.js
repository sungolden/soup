const {Client:DiscClient, Collection, SnowflakeUtil, DiscordAPIError} = require.main.require("discord.js")
const {getUser,humanReadablePermissions,getGuildDoc} = require.main.require("./utils")
const handleCommandData = require("./commandHandler")
const {errors} = require.main.require("./schemas")


//Setup Client
const client = new DiscClient()
global.Client = client
Client.config = require.main.require("../config")
Client.version = `0.1`

//Setup Commands
Client.commands = new Collection();
Client.permissions = []
//Read Commands
const fs = require.main.require('fs');
const getAllFiles = function(dirPath, prevFiles) {
    let files = fs.readdirSync(dirPath)
    let arrayOfFiles = prevFiles || []

    files.forEach(function(file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
        arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
        } else {
        arrayOfFiles.push(dirPath+"/"+file)
        }
    })
    return arrayOfFiles
} 

const commandFiles = getAllFiles('./bot/commands',[]).filter(file => file.endsWith('.js'));
//Add all command files to command list
Client.maxCommandLength = 0
for (const file of commandFiles) {
    const command = require.main.require(`./${file.substring(6)}`);
    command.fileLoc = `./${file.substring(6)}`
    Client.commands.set(command.name, command);
    if(command.name.split(" ").length > Client.maxCommandLength) Client.maxCommandLength = command.name.split(" ").length
    //Create permissions list from commands
    for (const perm of command.runPerms) {
        if(!Client.permissions.includes(perm)) Client.permissions.push(perm)
    }
}

//setup db
const Mongoose = require.main.require("mongoose")
Mongoose.connect(process.env.DB_URL || Client.config.dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});
Mongoose.connection
    .on('error',(error)=>{console.error(error);process.exit(1)})
    .once('open', function () {
    console.log("Connected to database, starting bot")
    Client.login(Client.config.token)
});

//Run bot
Client.on('ready', async () => {
    console.log(`Logged in as ${Client.user.tag} (ID: ${Client.user.id})!`);
    console.log(`${Client.guilds.cache.size} servers`);
    //Set client application
    Client.oauth = await Client.fetchApplication()
    await Client.user.setActivity(`${Client.config.prefix}help`, {type:"WATCHING"})
})
//Message handling
.on("message",async message =>{
    if(message.author.bot) return;

    //Get args
    let msg = message.content;
    //Check if starts with prefix or mention
    if(message.content.startsWith(Client.config.prefix)){
        //remove prefix from first argument
        msg = msg.substring(Client.config.prefix.length);
    }
    else if (message.content.startsWith(Client.user.toString())){
        msg = msg.substring(Client.user.toString().length)
    }
    else if (message.content.endsWith(" soup")){
        msg = msg.substring(0,message.content.length-" soup".length)
    }
    else return

    msg = msg.trim()

    try {
        //convert command to commandData
        let commandData = handleCommandData(msg)
        
        //Get command
        let command = Client.commands.get(commandData.command)
        if(!command) command = Client.commands.find(val=>(val.aliases.includes(commandData.command)))
        if(!command) return;
        
        //Check bot permissions
        if(message.guild && !message.channel.permissionsFor(Client.user).has(command.runPerms)){
            let botPermissions = message.channel.permissionsFor(Client.user).serialize()
            let requriedPermissions = command.runPerms
            let missing = []
            for (const item of requriedPermissions){
                if(!botPermissions[item]) missing.push(item)
            }
            for (let index = 0; index < missing.length; index++) {
                missing[index] = humanReadablePermissions[missing[index]];
            }
            if(missing.length > 0){
                return message.channel.send(`Missing permissions:\n> ${missing.join("\n> ")}`)
            }
        }

        //Check user permissions
        if(message.guild && !message.member.permissions.has(command.userPerms)){
            let userPermissions = message.member.permissions.serialize()
            let requriedPermissions = command.userPerms
            let missing = []
            for (const item of requriedPermissions){
                if(!userPermissions[item]) missing.push(item)
            }
            for (let index = 0; index < missing.length; index++) {
                missing[index] = humanReadablePermissions[missing[index]];
            }
            if(missing.length > 0){
                return
            }
        }

        //Run command
        return await command.execute(message, commandData)

    } catch (error) {
        //Error Handling
        let errorDoc = new errors({
            message: error.message,
            stack: error.stack
        })
        let errorID = errorDoc.id
        error.id = errorID
        errorDoc.save()
        console.error(error);
        message.reply(`there was an error trying to execute that command!\nError ID: \`${errorID}\``);
    }

})
//Graceful shutdown
process.on('SIGTERM', async () => {
    await Client.destroy()
    console.log("Destroyed client")
    process.exit(0)
  });