const Store = require("./store");
const { pathToData } = require("../config");

const db = new Store(pathToData, [
    require("./userORM"), 
    require("./discussionORM"),
    require("./notificationORM"),
    require("./friendshipORM")
]);

module.exports = db;



 