const Store = require("./store");

const db = new Store(pathToData, [
    require("./userORM"), 
    require("./discussionORM"),
    require("./notificationORM")
]);

module.exports = db;



 