module.exports = (sequelize, DataTypes) => {
    const user = sequelize.define('user', {
        socketId: {
            type: DataTypes.STRING
        },
        username: {
            type: DataTypes.STRING,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
        }
    })

    return user;
}