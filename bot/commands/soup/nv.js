const utils = require("../../utils");

module.exports = {
    name: 'nonverbal',
    aliases: ['non-verbal','nv'],
    description: 'shhh',
    catagory: "Soup",
    hidden: true,
    owner: false,
    guild: false,
    userPerms: [],
    runPerms: ["USE_EXTERNAL_EMOJIS"],
	async execute(message, data) {
        try{
            const soupsJson = require('../../soups.json')
            let soupEmoji = await Client.emojis.resolve(soupsJson.soup)
            let faces = ['😁🔇','🤭','🤫']
            let face = faces[faces.length * Math.random() << 0]
            message.channel.send(`${face}${soupEmoji.toString()}`,{split:true})

        } catch (error) {throw error}
    }
};