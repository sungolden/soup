const { Util } = require("discord.js");

const utils = require('../../utils')
module.exports = {
    name: 'get',
    aliases: ['cook','collect','make','soup'],
    description: 'soup\nMakes a soup (once every 4 hours)',
    catagory: "Misc",
    hidden: false,
    owner: false,
    guild: false,
    userPerms: [],
    runPerms: [],
	async execute(message, data) {
        try{
            const soupsJson = require('../../soups.json')
            let user = await utils.getUserDoc(message.author.id)
            let soups = soupsJson.soups
            let soupEmojiID = soupsJson.soup
            let cooldownTime = soupsJson.cooldown
            let soupEmoji = Client.emojis.resolve(soupEmojiID)

            let cooldown = new Date()
            cooldown.setHours(cooldown.getHours()-cooldownTime)
            let diff = Math.ceil(Math.abs(cooldown-user.last_cooked)/(1000*60*60))
            if(user.last_cooked > cooldown) return message.channel.send(`🥵${soupEmoji.toString()}‼${toNum(diff)}⏳`)

            let keys = Object.keys(soups);
            let soup = keys[ keys.length * Math.random() << 0];
            

            user.last_cooked = Date.now()
            user.soups.push(soup)

            let err, doc = await user.save()
            if(err) throw err
            message.channel.send(soups[soup]+soupEmoji.toString())
        } catch (error) {throw error}
    }
};
function toNum(int){
    let input = int.toString()
    let lookup = {
        "0":"0️⃣",
        "1":"1️⃣",
        "2":"2️⃣",
        "3":"3️⃣",
        "4":"4️⃣",
        "5":"5️⃣",
        "6":"6️⃣",
        "7":"7️⃣",
        "8":"8️⃣",
        "9":"9️⃣"
    }
    let output = ""
    for (var i = 0; i < input.length; i++) {
        output = lookup[input.charAt(i)];
      }
    return output
}