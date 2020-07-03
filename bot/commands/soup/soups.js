const utils = require("../../utils");

module.exports = {
    name: 'list',
    aliases: ['collection','soups'],
    description: 'list\nlists your collected soups',
    catagory: "Soup",
    hidden: false,
    owner: false,
    guild: false,
    userPerms: [],
    runPerms: [],
	async execute(message, data) {
        try{
            let user = await utils.getUserDoc(message.author.id)
            const soupsJson = require('../../soups.json')
            let soups = soupsJson.soups
            let soupEmoji = await Client.emojis.resolve(soupsJson.soup)

            let soupArray = user.soups
            soupArray = soupArray.sort()
            let soupCounts = {}
            for (var i = 0; i < soupArray.length; i++) {
                var num = soupArray[i];
                soupCounts[num] = soupCounts[num] ? soupCounts[num] + 1 : 1;
            }

            // message.channel.send(JSON.stringify(soupCounts))
            let soupList = ""
            for (const soup in soupCounts) {
                if (soupCounts.hasOwnProperty(soup)) {
                    const soupCount = soupCounts[soup];
                    soupList += `\n${toNum(soupCount)}${soups[soup]}${soupEmoji.toString()}`
                }
            }
            message.channel.send(soupList,{split:true})

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
        output += lookup[input.charAt(i)];
      }
    return output
}