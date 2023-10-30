const users = []

const addUser = (user) => {

    users.push(user)
}

const getUser = (id) => {
    const i = users.find(user => {
        user.id === id
    })

    if (i !== -1)
        return users[i]
}

const deleteUser = (id) => {
    const i = users.find(user => {
        user.id === id
    })

    if (i !== -1)
        return users.splice(i, 1)[0]
}

module.exports = {
    addUser,
    getUser,
    deleteUser
}