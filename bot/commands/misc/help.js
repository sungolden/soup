const {profiles} = require("../../schemas")

module.exports = {
    name: 'help',
    aliases: [],
    description: 'help\n> Displays the command list\n\nhelp [command]\n> Displays info about a command',
    catagory: "Misc",
    hidden: false,
    owner: false,
    userPerms: [],
    runPerms: [],
	async execute(message, commandData) {
        if(commandData.arguments.length > 0) {
            try{
                let command = Client.commands.get(commandData.arguments[0])
                if(!command) command = Client.commands.find(val=>(val.alias.contains(commandData.arguments[0])))
                if(!command) return message.channel.send("No command found");
                message.channel.send("**"+command.name+":** \n"+command.description)
            } catch (error) {throw error}
        } else {
            try{
                let msg = ``
                Client.commands.forEach(command => {
                    if(command.hidden) return
                    let commandText = Client.config.prefix+command.description.split("\n")[0]
                    if(!message.channel.permissionsFor(Client.user).has(command.runPerms)) commandText = "*"+commandText
                    else if(!message.member.permissions.has(command.userPerms))commandText = "!"+commandText
                    msg += commandText+"\n"
                });
                message.channel.send(msg)
            } catch (error) {throw error}
        }
    }
};