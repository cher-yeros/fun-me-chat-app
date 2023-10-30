const {
    sequelize,
    User,
    Chat
} = require("../models");

const chats = require('./chats.json')
const users = require('./users.json')

sequelize.sync({
        force: true
    })
    .then(async function () {
        await users.map(user => {
            User.create(user)
        })

        await chats.map(chat => {
            Chat.create(chat)
        })
    })