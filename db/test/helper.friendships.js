const Store = require("../store");
const friendshipORM = require("../friendshipORM");


// Need to redo the tests
const testing = (pathToDb) => {

    const db = new Store(pathToDb, [
        friendshipORM
    ]);


    describe("Sending friendRequest", () => {
        const senderId = "2";
        const receiverId = "4";
        const fs = (fships) => (
            fships[`${senderId}#${receiverId}`] 
            || fships[`${receiverId}#${senderId}`]
        )
        

        test("Should return undefined when the connection between the 2 is non existant", () => {
            const friendships = (db.get()).friendships
            expect(fs(friendships)).toBeUndefined();
        });


        test("Should return a new friendships key after sending a request", () => {
            db.sendFriendRequest(senderId, receiverId);
            const friendships = (db.get()).friendships;
            const fs1 = fs(friendships);
            expect(fs1).toHaveProperty("user1Id", senderId);
            expect(fs1).toHaveProperty("status", 2)
        })

        test.todo("Should return an error when request is already pending, confirmed or declined");

    })
    

    describe("Answering Friend Request", () => {
        const senderId = "3";
        const receiverId = "4";

        const fs = (fships) => (
            fships[`${senderId}#${receiverId}`] 
            || fships[`${receiverId}#${senderId}`]
        );

        
        test("Should update the friendship status to CONFIRMED on accepting", () => {
            db.sendFriendRequest(senderId, receiverId);
            db.acceptFriendRequest(senderId, receiverId);
            const friendships = (db.get()).friendships;
            expect(fs(friendships)).toHaveProperty("status", 1);
        })


        test("Should delete the friendship", () => {
            db.deleteFriendship(senderId, receiverId);
            const friendships = (db.get()).friendships;
            expect(fs(friendships)).toBeUndefined();
        })
        

        test("update the friendship status to DECLINED on declining", () => {
            db.sendFriendRequest(senderId, receiverId);
            db.declineFriendRequest(senderId, receiverId);
            const friendships = (db.get()).friendships;
            expect(fs(friendships)).toHaveProperty("status", 3);

            // temporary fix cause db is not identical before start and after end
            db.deleteFriendship(senderId, receiverId); 
        })
    })

};

module.exports = testing;