module.exports = {
    name: 'ping',
    aliases: ['pong'],
    description: 'ping\n> Responds to the user\n> Options:\n> --echo=[text]   Responds with text',
    catagory: "Misc",
    hidden: true,
    owner: false,
    guild: false,
    userPerms: [],
    runPerms: [],
	async execute(message, data) {
        try{
            let msg
            if(data.hasOption("echo") && data.getOption("echo") != undefined){
                msg = data.getOption("echo")
            }
            message.reply(msg+"\nPong!")
        } catch (error) {throw error}
    }
};