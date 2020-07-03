module.exports = {
    name: 'reload',
    aliases: [],
    description: '',
    catagory: "Misc",
    hidden: true,
    owner: true,
    guild: false,
    userPerms: [],
    runPerms: [],
	async execute(message, data) {
        try{
            delete require.cache[require.resolve('../../soups.json')]; 
            message.reply('Reloaded!')
        } catch (error) {throw error}
    }
};