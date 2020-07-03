const {errors} = require("../../schemas")
const {Util} = require("discord.js")

module.exports = {
    name: 'error',
    aliases: [],
    description: 'error [id]\n> Returns an error message from the database',
    catagory: "OWNER",
    hidden: true,
    owner: true,
    guild: false,
    userPerms: [],
    runPerms: [],
	async execute(message, messageData) {
        try{
            if(messageData.arguments.length < 1) return message.channel.send("Please provide an error ID")
            let error = await errors.findOne({_id: messageData.arguments[0]})
            if(error == null) return message.channel.send("Invalid ID")
            return message.channel.send(`> **${Util.escapeMarkdown(error.message)}**\n\`\`\`js\n${Util.escapeMarkdown(error.stack)}\`\`\``)
        } catch (error) {throw error}
    }
};