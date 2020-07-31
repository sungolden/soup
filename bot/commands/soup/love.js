const utils = require("../../utils");

module.exports = {
    name: 'thank',
    aliases: ['love','thanks'],
    description: 'thank soup',
    catagory: "Soup",
    hidden: false,
    owner: false,
    guild: false,
    userPerms: [],
    runPerms: ["USE_EXTERNAL_EMOJIS"],
	async execute(message, data) {
        try{
            const soupsJson = require('../../soups.json')
            let soupEmoji = await Client.emojis.resolve(soupsJson.soup)
            let hearts = ['❤','🧡','💛','💚','💙','💜','🤎','🖤','🤍','💕','💞','💓','💗','💖']
            let heart = hearts[hearts.length * Math.random() << 0]
            message.channel.send(`${heart}${soupEmoji.toString()}☺`,{split:true})

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