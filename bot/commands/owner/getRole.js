const {MessageEmbed} = require.main.require("discord.js")
const {getRole} = require("../../utils")

module.exports = {
    name: 'owner get role',
    aliases: [],
    description: 'gets a role',
    catagory: "OWNER",
    hidden: true,
    owner: true,
    guild: false,
    userPerms: [],
    runPerms: [],
	async execute(message, args) {
        try{
            let roleName = args.join(" ")
            let role = await getRole(roleName, message.guild)
            if(!role) return message.channel.send("Role not found")
            let embed = new MessageEmbed()
                .setTitle(role.name)
                .setColor(role.color)
                .addFields([{name:"Colour",value:role.hexColor,inline:true},{name:"ID",value:role.id,inline:true},{name:"Hoist",value:role.hoist,inline:true},{name:"Position",value:role.position,inline:true},{name:"Created",value:role.createdAt.toGMTString(),inline:true},{name:"Permissions",value:"```"+role.permissions.toArray().join("\n")+"```",inline:false}])
            return message.channel.send(embed)
        } catch (error) {throw error}
    }
};