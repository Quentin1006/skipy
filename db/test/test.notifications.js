const { isEmpty, has } = require("lodash");
const debug= require("debug")("test:notificatons");


const Store = require("../store");
const discussionORM = require("../discussionORM");
const notificationORM = require("../notificationORM");

// Need to redo the tests
const testing = (pathToDb) => {

    const db = new Store(pathToDb, [
        discussionORM,
        notificationORM
    ])

    debug("Should contains the method from discussion orm", db.get && db.getDiscussion === discussionORM.getDiscussion);
    debug("Should be a valid discussion object", !isEmpty(db.getDiscussion(0)));

    // notif for this user 
    const idUser1 = require("../../config/secret").quentin.id;
    // no notif for this user
    const idUser2 = 2
    // unknown user
    const unknown = "er";

    // get User notification
    debug("Should return an array of notifications", !isEmpty(db.getUserNotifications(idUser1) ));
    debug("Should return an empty array", isEmpty(db.getUserNotifications(unknown)));



    // notif creation
    const createdNotif = db.createNotification(idUser1, {type: "message", from:idUser1, to:idUser2, content:"just a test notification"})
    debug("Should append the notification to the existing ones", db.get().notifications[idUser1].length === 4);
    debug("Should return a new notif", has(createdNotif, "id"));


    // notif deletion
    db.deleteNotification(idUser1, createdNotif.id)
    debug("Should delete the previsously created notif", 
        (() => {
            const userNotifs = db.get().notifications[idUser1];
            const match = userNotifs.filter(notif => notif.id === createdNotif.id)
            return isEmpty(match);
        })()
    );

    debug("Should return: no notif for this user", db.deleteNotification(3, 1));
    debug("Should return; no notif with this id for the user", db.deleteNotification(idUser1, 11));

};


module.exports = testing;