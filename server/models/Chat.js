module.exports = (sequelize, DataTypes) => {
    const Song = sequelize.define('chat', {
        messege: {
            type: DataTypes.STRING,
            allowNull: false
        },
        seen: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        }
    })

    return Song;
}