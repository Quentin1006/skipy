const { deepCopy } = require("../utils");

module.exports = (db) => {
    const User = require("./userORM")(db);

    const getUserNotifications = (userId) => {
        const data = db.get();
        const { users } = data;

        let notifications;
        users.some(user => {
            if(user.id === userId){
                notifications = user.notifications;
                return true;
            }
        });
        return notifications;
    }


    const createNotification = (userId, notif) => {
        const userNotifs = getUserNotifications(userId);

        notif.id = userNotifs.length > 0 ? userNotifs[userNotifs.length-1].id+1 : 0;
        notif.date = Date.now();
        userNotifs.push(notif);

        updateNotifications(userId, userNotifs);

        return notif;
    }

    const updateNotifications = (userId, notifs) => {
        const data = db.get();
        const userIndex = User.getUserIndex(userId);
        data.users[userIndex].notifications = notifs;

        db.set(data);
    }


    const deleteNotification = (userId, notifId) => {
        const notifications = getUserNotifications(userId);
        let deletedNotif = {};
        const updatedNotifs = notifications.filter((notif) => {
            if(notif.id !== notifId){
               return notif;
            }
            else {
                deletedNotif = notif; 
            }
        });

        updateNotifications(userId, updatedNotifs)

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
        getUserNotifications,
        getNotification
    }
}