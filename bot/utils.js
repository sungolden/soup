

humanReadablePermissions = {
    ADMINISTRATOR:"Administrator",
    CREATE_INSTANT_INVITE:"Create Invite",
    KICK_MEMBERS:"Kick Members",
    BAN_MEMBERS:"Ban Members",
    MANAGE_CHANNELS:"Manage Channels",
    MANAGE_GUILD:"Manage Server",
    ADD_REACTIONS:"Add Reactions",
    VIEW_AUDIT_LOG:"View Audit Log",
    PRIORITY_SPEAKER:"Priority Speaker",
    VIEW_CHANNEL:"Read Text Channels & See Voice Channels",
    SEND_MESSAGES:"Send Messages",
    SEND_TTS_MESSAGES:"Send TTS Messages",
    MANAGE_MESSAGES:"Manage Messages",
    EMBED_LINKS:"Embed Links",
    ATTACH_FILES:"Attach Files",
    READ_MESSAGE_HISTORY:"Read Message History",
    MENTION_EVERYONE:"Mention Everyone",
    USE_EXTERNAL_EMOJIS:"Use External Emoji",
    CONNECT:"Connect",
    SPEAK:"Speak",
    MUTE_MEMBERS:"Mute Members",
    DEAFEN_MEMBERS:"Defen Members",
    MOVE_MEMBERS:"Move Members",
    USE_VAD:"Use Voice Activity",
    CHANGE_NICKNAME:"Change Nickname",
    MANAGE_NICKNAMES:"Manage Nickname",
    MANAGE_ROLES:"Manage Roles",
    MANAGE_WEBHOOKS:"Manage Webhooks",
    MANAGE_EMOJIS:"Manage Emoji",
}

//Get Docs Utils
const {guilds, users} = require.main.require("./schemas")
async function getGuildDoc(id){
    let guild = await guilds.findOne({id:id})
    if(!guild){
        guild = new guilds({id:id})
    }
    return guild
}
async function getUserDoc(id){
    let user = await users.findOne({id:id})
    if(!user){
        user = new users({id:id})
    }
    return user
}

async function sendPages(pages, message, page, userID, start){
    if(pages.length == 1) return
    if(page < 0) page = 0//pages.length-1
    if(page > pages.length-1) page = pages.length-1//0
    let pageNum = `\n[${page+1}/${pages.length}]`
    await message.edit(pages[page]+pageNum)
    if(start)await message.react("◀")
    if(start)await message.react("❌")
    if(start)await message.react("▶")
    let filter = (reaction,user) => (reaction.emoji.name === '◀' || reaction.emoji.name === "▶" || reaction.emoji.name === "❌") && user.id === userID
    let collected  = await message.awaitReactions(filter,{max:1,time:60000})
    let reaction = collected.first()
    if(!reaction) return message.reactions.removeAll()
    await reaction.users.remove(userID)
    switch(reaction.emoji.name){
        case "◀":
            return sendPages(pages,message,page-1,userID,false)
        case "▶":
            return sendPages(pages,message,page+1,userID,false)
        default:
            return message.reactions.removeAll()
    }
}

async function getChannel(string,guild){
    return await guild.channels.cache.find(channel=>{
        if(channel.name.toLowerCase() == string.toLowerCase()) return true
        if(channel.toString() == string) return true
        if(channel.id == string) return true
        return false
    })
}

async function getUser(mention){
    if (!mention) return null;
    return Client.users.cache.find((user)=>{
        if(user.toString() === mention.replace("!","")) return true
        if(user.id === mention) return true
        if(user.tag === mention) return true
        return false
    })
}

async function getRole(mention, guild){
    if (!mention) return null;
    return guild.roles.cache.find((role)=>{
        if(role.id === mention) return true
        if(role.toString() === mention) return true
        if(role.name.toLowerCase() == mention.toLowerCase()) return true
        if(role.name.toLowerCase().replace(/[^\w|\s]/g,"") == mention.toLowerCase().replace(/[^\w|\s]/g,"")) return true
        return false
    })
}

async function findQuote(args){
    let pairs = {
        0:[`'`,`'`],
        1:[`"`,`"`],
        2:['“','”'],
        3:['‘','’']
  }
  let id   
  for (const key in pairs) {
      if (pairs.hasOwnProperty(key)) {
          const pair = pairs[key];
          if(args[0].startsWith(pair[0])){
               id = key
                args[0] = args[0].substring(1)
              break
          }
      }
  }
  if(!id) return args
  let index = 0
    for (const part of args) {
      if(part.endsWith(pairs[id][1])){
         args[index] = part.substring(0,part.length-1)
         break
      }
      index++
  }
  let quotedString = args.slice(0,index+1).join(" ")
  args.splice(0,index+1,quotedString)
  return args
}


module.exports = {
    getUser: getUser,
    getChannel: getChannel,
    getRole: getRole,
    humanReadablePermissions: humanReadablePermissions,
    getGuildDoc: getGuildDoc,
    getUserDoc: getUserDoc,
    pageMenu: sendPages,
    findQuote: findQuote
}