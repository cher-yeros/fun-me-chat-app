const {
    Chat,
    Sequelize,
    User
} = require('../models')
const {
    Op
} = require('sequelize');
const {
    request
} = require('express');

let cs = [];

module.exports = {
    getAll(req, res) {
        const sc = Chat.findAll({
            where: {
                [Op.or]: [{
                        senderId: req.body.sender,
                        receiverId: req.body.receiver
                    },
                    {
                        senderId: req.body.receiver,
                        receiverId: req.body.sender
                    }
                ]
            },
            include: ['sender', 'receiver']
        }).then(chats => {
            Chat.count({
                where: {
                    [Op.and]: [{
                        [Op.or]: [{
                                senderId: req.body.sender,
                                receiverId: req.body.receiver
                            },
                            {
                                senderId: req.body.receiver,
                                receiverId: req.body.sender
                            }
                        ]
                    }, {
                        seen: false
                    }]

                }
            }).then(no => {
                console.log(no);
                res.send({
                    chats,
                    unseenCount: no
                })
            })

        }).catch(err => console.log("error", err));
    },
    markSeen(req, res) {
        Chat.update({
            seen: true
        }, {
            where: {
                [Op.and]: [{
                    senderId: req.body.sender,
                    receiverId: req.body.thisUser
                }, {
                    seen: false
                }]
            }
        }).then(result => {
            res.send({
                result
            })
        })
    }
}