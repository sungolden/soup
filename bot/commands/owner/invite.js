const {MessageEmbed} = require("discord.js")

module.exports = {
    name: 'invite',
    aliases: ['about','info','git','github'],
    description: 'invite\n> Creates an invite for the bot',
    catagory: "Misc",
    hidden: false,
    owner: false,
    userPerms: [],
    runPerms: ["EMBED_LINKS"],
	async execute(message, args) {
        try{
            let inviteURL = await Client.generateInvite(Client.permissions)
            message.channel.send(
                new MessageEmbed()
                .setDescription(`[invite](${inviteURL}) | [git](https://github.com/BeeFox-sys/soup)`))
        } catch (error) {throw error}
    }
};