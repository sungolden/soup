const Mongoose = require.main.require("mongoose")


let guild = new Mongoose.Schema({
    id: String
})
let user = new Mongoose.Schema({
    id: String,
    last_cooked: {type: Date, default: new Date(0)},
    soups: [String]
})
let error = new Mongoose.Schema({
    message: String,
    stack: String
})


module.exports = {
    users: Mongoose.model('users', user),
    guilds: Mongoose.model('guilds',guild),
    errors: Mongoose.model('errors', error)
}