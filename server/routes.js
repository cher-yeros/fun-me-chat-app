const express = require('express');
const router = express.Router()
const UserController = require('./controllers/user.controller')
const ChatController = require('./controllers/chat.controller')
const UserMiddleWare = require('./middleware/user.middleware')

router.get('/', (req, res) => {
    res.send("Working now")
})

router.post('/register', UserMiddleWare.register, UserController.register)
router.post('/login', UserMiddleWare.login, UserController.login)
router.get('/users/:id', UserController.getAll)
router.post('/chats', ChatController.getAll)
router.post('/chats/makeseen', ChatController.markSeen)

module.exports = router