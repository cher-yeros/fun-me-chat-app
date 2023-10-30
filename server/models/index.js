const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const config = require("../config/config");

const sequelize = new Sequelize("funmechat", "root", "", {
  host: "localhost",
  dialect: "mysql",
  // logging: false


});

db = {};

// fs.readdirSync(__dirname)
//     .filter((file) =>
//         file !== 'index.js'
//     )
//     .forEach((file) => {
//         // const model = sequelize.require(path.join(__dirname, file))

//         // db[model.name] = model;
//         db[model.name] = require('./');

//         console.log(file);
//     });

db.Chat = require("./Chat")(sequelize, Sequelize);
db.User = require("./User")(sequelize, Sequelize);

db.Chat.belongsTo(db.User, {
  as: "sender",
});
db.Chat.belongsTo(db.User, {
  as: "receiver",
});

db.User.hasMany(db.Chat)

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;