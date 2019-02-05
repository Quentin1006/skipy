const { isEmpty, has } = require("lodash");
const debug= require("debug")("test:users");


const Store = require("../store");
const userORM = require("../userORM");
const discussionORM = require("../discussionORM");
const { gontran, quentin } = require("../../config/secret");

const testing = (pathToDb) => {

    const db = new Store(pathToDb, [
        userORM,
        discussionORM
    ])



    // notif for this user 
    const idUser1 = 0
    // no notif for this user
    const idUser2 = gontran.id;

    const discWith3UnreadMessagesId = 5;

    debug("\n\n---- GETTING USERS BY FILTER ----\n\n");
    debug("Should return a list of users with")
    debug(
        " => provider fake, and firstname contains tin", 
        db.getUsers({provider:"fake", firstname:"tin"})
            .every(el => (el.provider === "fake" && el.firstname.includes("tin")))
    );
    debug(
        " => provider fake, and firstname contains ont", 
        db.getUsers({provider:"fake", firstname:"ont"}).length === 0
    );

    debug("Should search thru nested object",
        (db.getUsers({provider:"fake", firstname:"mal", "registered.age": 5})[0]).firstname === "malou"
    )

    debug("Should return object user Quentin Sahal by searching with shortcut getUserByMail",
        db.getUserByMail(quentin.email).email === quentin.email
    )

    debug("Should return object user with id 232 by searching with shortcut getUserById",
        db.getUserById(232).id === "232"
    )

     
    // const activeDiscussions = db.getUserActiveDiscussions(idUser2);
    // const discWithId5 = activeDiscussions.filter(disc => disc.id === discWith3UnreadMessagesId)[0];
    // const unreadFromDisc = discWithId5.unreadMessagesCount;
    // debug("Should return 1 unread messages (from the user):", unreadFromDisc);

    debug("\n\n---- GETTING FRIENDS OF A USER ----\n\n")
    debug("Should return a number of  259 friends", db.getUserFriends(idUser2).length === 259);
    debug("Should return a list of friends of 1 friend", db.getUserFriends(0).length === 1);
    debug("-----------------------------------")


    debug("\n\n---- UPDATING USER (CASE CORRECT) ----\n\n");

    const user2 = db.getUserById(idUser2)
    debug("User should have a matching id", user2.id === idUser2);
    debug("User nat should be FR", user2.nat === "FR");
    debug("User firstname should be gontran", user2.firstname.toLowerCase() === "gontran");

    debug("\n\n---- AFTER UPDATE - UPDATED USER ----\n\n");

    const updatedUser = db.updateUser(idUser2, {nat: "GB", firstname: "Luc"});
    debug("User nat should be GB", updatedUser.nat === "GB");
    debug("User firstname should be Luc", updatedUser.firstname.toLowerCase() === "luc");
    
    debug("")
    debug("")
    
    debug("\n\n---- AFTER UPDATE - GET USER ----\n\n");

    const updatedUserById = db.getUserById(idUser2)
    debug("User should have a matching id", updatedUserById.id === idUser2);
    debug("User nat should be GB", updatedUserById.nat === "GB");
    debug("User firstname should be Luc", updatedUserById.firstname.toLowerCase() === "luc");

    debug("")
    debug("")
    debug("\n\n---- UPDATING USER (CASE INCORRECT) ----\n\n");


    const user2Incorrect = db.getUserById(idUser2)
    debug("User should have a matching id", user2Incorrect.id === idUser2);
    debug("User nat should be GB", user2Incorrect.nat === "GB");
    debug("User firstname should be luc", user2Incorrect.firstname.toLowerCase() === "luc");


    debug("\n\n---- AFTER UPDATE - UPDATED USER ----\n\n");
    try {
        debug("Should not work when updating with incorrect model")
        const updatedUserIncorrect = db.updateUser(idUser2, {firstname: 3, inexistantField: "Luc"});
    }
    catch(e){
        debug("Should return a ValidationError", e.name === "ValidationError")
    }
    
    debug("\n\n---- AFTER UPDATE - GET USER ----\n\n");

    const updatedUserByIdIncorrect = db.getUserById(idUser2)
    debug("User should have a matching id", updatedUserByIdIncorrect.id === idUser2);
    debug("User nat should be GB", updatedUserByIdIncorrect.nat === "GB");
    debug("User firstname should be Luc", updatedUserByIdIncorrect.firstname.toLowerCase() === "luc");
};


module.exports = testing;