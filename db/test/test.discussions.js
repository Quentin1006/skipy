const debug= require("debug")("test:discussions");


const Store = require("../store");
const discussionORM = require("../discussionORM");


const testing = (pathToDb) => {

    const db = new Store(pathToDb, [
        discussionORM
    ])


    // notif for this user 
    const idUser1 = 0
    // no notif for this user
    const idUser2 = require("../../config/secret").gontran.id;

    debug("Test entering firstname, Should return array of 2 el with ids 1, 108", db.getMatchingSuggestions(idUser2, "Andrea", 3));
    debug("Test entering lastname, Should return array of 3 el with ids 46, 108, 341", db.getMatchingSuggestions(idUser2, "Nielsen", 3));
    debug("Test entering fullname, Should return array of 1 el with id 108", db.getMatchingSuggestions(idUser2, "Andrea Niel", 3));


    debug("Test with less suggestions that desired, Should return 5 users", db.getMatchingSuggestions(idUser2, "Ca", 10));
    debug("Test with more suggestions that desired, Should return 2 users", db.getMatchingSuggestions(idUser2, "Ca", 2));


    debug("Test with no suggestion", db.getMatchingSuggestions(idUser2, "Xk", 2));

    debug("Test with empty search", db.getMatchingSuggestions(idUser2, "", 2));

    

};


module.exports = testing;