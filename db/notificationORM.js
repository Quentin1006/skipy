const debug = require("debug")("orm:notification");
const { deepCopy } = require("../utils");
const { isEmpty } = require("lodash");
const Notification = require("../models/Notification");


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


    const createNotification = (to, {content, type, from}) => {
        const userNotifs = getUserNotifications(to);

        if(isEmpty(userNotifs)){
            debug("No notifications for the user", to);
        }

        try {
            const newNotif = new Notification({
                to,
                content,
                type,
                from
            });

            userNotifs.push(newNotif);
            _updateNotifications(to, userNotifs);

            return {res: {
                notif: newNotif
            }}
        }
        catch(err){
            return {
                err
            }
        }
        
    }


    const deleteNotification = (userId, notifId) => {
        const notifications = getUserNotifications(userId);

        if(isEmpty(notifications)){
            debug("No notifications for the user", userId);
            return {err: true};
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
            return {err: true};
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