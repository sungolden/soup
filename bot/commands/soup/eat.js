const utils = require("../../utils");

module.exports = {
    name: 'eat',
    aliases: ['nom','slurp','slurmp'],
    description: 'eat | eats a random soup and resets wait time',
    catagory: "Soup",
    hidden: false,
    owner: false,
    guild: false,
    userPerms: [],
    runPerms: ["USE_EXTERNAL_EMOJIS"],
	async execute(message, data) {
        try{
            let user = await utils.getUserDoc(message.author.id)
            const soupsJson = require('../../soups.json')
            let soups = soupsJson.soups
            let soupEmoji = await Client.emojis.resolve(soupsJson.soup)

            if(user.soups.length < 1) return message.channel.send(`❌${soupEmoji.toString()}`)

            let soupID = user.soups.length * Math.random() << 0
            let soup = user.soups[soupID]
            user.soups.splice(soupID,1)
            user.last_cooked.setHours(user.last_cooked.getHours()-soupsJson.cooldown)
            user.markModified("last_cooked")
            let err, doc = await user.save()
            if(err) throw err
            message.channel.send(`🥄${soups[soup]}${soupEmoji.toString()}`)
            

        } catch (error) {throw error}
    }
};
