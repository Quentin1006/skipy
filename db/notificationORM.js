const debug = require("debug")("orm:notification");
const { deepCopy } = require("../utils");
const { isEmpty } = require("lodash");


module.exports = (db) => {

    const _updateNotifications = (userId, notifs) => {
        const data = db.get();
        const { notifications } = data;
        const userNotifications = notifs;

        const updatedNotifs = {
            ...notifications,
            [userId]: userNotifications
        }

        db.set({
            ...data,
            notifications: updatedNotifs
        });
    }


    const getUserNotifications = (userId) => {
        const data = db.get();
        const { notifications } = data;

        // We are not trying to see whether the userID actually exists
        return notifications[userId] || [];
    }


    const createNotification = (userId, notif) => {
        const userNotifs = getUserNotifications(userId);

        if(isEmpty(userNotifs)){
            debug("No notifications for the user", userId);
            return {};
        }

        notif.id = userNotifs.length > 0 ? userNotifs[userNotifs.length-1].id+1 : 0;
        notif.date = Date.now();
        userNotifs.push(notif);

        _updateNotifications(userId, userNotifs);

        return notif;
    }


    const deleteNotification = (userId, notifId) => {
        const notifications = getUserNotifications(userId);

        if(isEmpty(notifications)){
            debug("No notifications for the user", userId);
            return {};
        }

        let deletedNotif = {};
        const updatedNotifs = notifications.filter((notif) => {
            if(notif.id !== notifId){
               return notif;
            }
            else {
                deletedNotif = notif; 
            }
        });


        if(isEmpty(deletedNotif)){
            debug("No notification corresponding to this id", notifId);
            return {};
        }

        _updateNotifications(userId, updatedNotifs)

        return deletedNotif;
    }


    const deleteNotifications = (userId, notifArray) => {
        return notifArray.map((notifId) => {
            return deleteNotification(userId, notifId);
        })
    }

    const getNotification = () => {};



    return {
        createNotification,
        deleteNotification,
        deleteNotifications,
        getUserNotifications,
        getNotification
    }
}