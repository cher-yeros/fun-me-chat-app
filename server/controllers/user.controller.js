const {
    User,
    Chat
} = require('../models')

const {
    Op,
    Sequelize
} = require('sequelize')

let usersArray = [];
module.exports = {
    register(req, res) {
        User.create(req.body).then(result => {
            res.send({
                success: true,
                user: result
            })
        }).catch(err => {
            res.status(400).send(
                err
            )
        })
    },
    login(req, res) {
        User.findOne({
            where: {
                username: req.body.username,
                password: req.body.password
            }
        }).then(user => {

            if (user) {
                res.send({
                    success: true,
                    user
                })
            } else {
                res.send({
                    success: false
                })
            }

        }).catch(err => {
            res.status(400).send(
                err
            )
        })
    },
    async getAll(req, res) {
        // User.findAll({
        //     include: {
        //         model: Chat,
        //         where: {
        //             [Op.and]: [{
        //                 senderId: Sequelize.col('user.id'),
        //                 receiverId: req.params.id
        //             }, {
        //                 seen: false
        //             }]
        //         },
        //         attributes: {
        //             include: [
        //                 [Sequelize.fn('COUNT', Sequelize.col('messege')), 'n_hats']
        //             ]
        //         }
        //     }
        // }).then(j => {
        //     res.send(j)
        // })




        var l = 0
        const users = await User.findAll();

        users.map(async (user) => {
            const no = await Chat.count({
                where: {
                    [Op.and]: [{
                        senderId: user.id,
                        receiverId: req.params.id
                    }, {
                        seen: false
                    }]
                }
            });

            usersArray[l] = {
                info: user.toJSON(),
                unseenCount: no
            }
            l++
            res.send({
                users: usersArray
            })
        })
    }
}