const Store = require("../store");
const discussionORM = require("../discussionORM");
const notificationORM = require("../notificationORM");

// notif for this user 
const idUser1 = require("../../config/secret").quentin.id;
// no notif for this user
const idUser2 = 2
// unknown user
const unknown = "er";
const createdNotifId = 4;

// Need to redo the tests
const testing = (pathToDb) => {

    const db = new Store(pathToDb, [
        discussionORM,
        notificationORM
    ])

    describe("Db Store should have the correct methods", () => {
        test("Should contains its own method get", () => {
            expect(db.get).toBeTruthy();
        });

        test("Should return a valid discussion object", () => {
            expect(db.getDiscussion(0)).toHaveProperty("id", 0);
        });
    })
    
    
    // get User notification
    describe("Testing notifications", () => {
        test("Should return an array of notifications", () => {
            const notifs = db.getUserNotifications(idUser1);
            expect(notifs).toHaveLength(3);
        })

        test("Should return an empty array", () => {
            const notifs = db.getUserNotifications(unknown);
            expect(notifs).toHaveLength(0);
        })


        // notif creation   
        test("Should append the notification to the existing ones", () => {
            const createdNotif = db.createNotification(
                idUser1, 
                {
                    type: "message", 
                    from:idUser2, 
                    to:idUser1, 
                    content:"just a test notification"
                }
            );
            const notifs = db.get().notifications[idUser1];
            expect(notifs).toHaveLength(4);
            expect(createdNotif).toHaveProperty("id");
        });


        // notif deletion
        test("Should delete the previsously created notif", () => {
            const deletedNotif = db.deleteNotification(idUser1, createdNotifId);
            const userNotifs = db.get().notifications[idUser1];
            
            expect(userNotifs).not.toContainEqual({id: createdNotifId});

            
        })

        test("Deleting a notification for user who doesnt have any", () => {
            expect(db.deleteNotification(3, 1)).toMatchObject({});
        })

        test("Deleting a notification for a user that doesnt exist", () => {
            expect(db.deleteNotification(idUser1, 11)).toMatchObject({});
        })

    })

};


module.exports = testing;