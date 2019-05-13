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

    describe("Testing method db.getUsers", () => {
        test("search with provider fake, and firstname contains 'tin' all match criterion", () => {
            const matchingUsers = db.getUsers({provider:"fake", firstname:"tin"});
            const allMatchCriterion = matchingUsers.every(el => (
                el.provider === "fake" 
                && el.firstname.includes("tin"))
            )
            expect(allMatchCriterion).toBeTruthy();
        });

        test("search with provider fake, and firstname contains 'ont' should have no match", () => {
            const matchingUsers = db.getUsers({provider:"fake", firstname:"ont"});
            expect(matchingUsers).toHaveLength(0);
        });

        test("Should search thru nested object", () => {
            const userMalou = (db.getUsers({provider:"fake", firstname:"mal", "registered.age": 5})[0]);
            expect(userMalou).toHaveProperty("firstname", "malou");
        });

        test("Should return object user Quentin Sahal by searching with shortcut getUserByMail", () => {
            expect(db.getUserByMail(quentin.email)).toHaveProperty("email", quentin.email);
        });

        test("Should return object user with id 232 by searching with shortcut getUserById", () => {
            expect(db.getUserById(232)).toHaveProperty("id", "232");
        });
    });

    describe("Testing method getUsersByName", () => {
        const text = 'sah';
        test(`search should return only user with ${text} in their firstname or lastname`, () => {
            expect(db.getUsersByName(text)).toHaveLength(1);
        })

        test(`search with text too short should return empty array`, () => {
            expect(db.getUsersByName(text, {minLength:4})).toHaveLength(0);
        });


        test(`search should return nb of result <= to the max requested`, () => {
            expect(db.getUsersByName("s", {max: 5, minLength:1})).toHaveLength(5);
        });

    });


    describe("Getting friends for a user", () => {
        test.each([["gontran", gontran.id, 259], ["user0", "0", 1]])(
            "user %s should have the right number of friends",
            (name, id, nbFriends) => {
                const friendlist = db.getUserFriends(id);
                expect(friendlist).toHaveLength(nbFriends)
            }
        )
    })

    describe("Updating user", () => {
        test("Should have right properties before updating", () => {
            const userGontran = db.getUserById(gontran.id);
            expect(userGontran).toHaveProperty("id", gontran.id);
            expect(userGontran).toHaveProperty("nat", "FR");
            expect(userGontran.firstname).toMatch(/gontran/i);
        })

        test("Should update user nat and firstname and return updated user", () => {
            const updatedUser = db.updateUser(gontran.id, {nat: "GB", firstname: "Luc"});
            expect(updatedUser).toHaveProperty("nat", "GB");
            expect(updatedUser.firstname).toMatch(/luc/i);

        })


        test("Retrieving the user from the db should return updated user", () => {
            const updatedUserInDb = db.getUserById(gontran.id);
            expect(updatedUserInDb).toHaveProperty("id", gontran.id);
            expect(updatedUserInDb).toHaveProperty("nat", "GB");
            expect(updatedUserInDb.firstname).toMatch(/luc/i);
        })


        test("Bad Update should return an a ValidationError", () => {
            try {
                db.updateUser(
                    idUser2, 
                    {firstname: 3, inexistantField: "Luc"}
                );
            }
            catch({name}){
                expect(name).toBe("ValidationError");
            }
        });

        test("User remains unchanged after bad update", () => {
            const userAfterBadUpdate = db.getUserById(gontran.id);
            expect(userAfterBadUpdate).toHaveProperty("id", gontran.id);
            expect(userAfterBadUpdate).toHaveProperty("nat", "GB");
            expect(userAfterBadUpdate.firstname).toMatch(/luc/i);
        })
        



    })
};


module.exports = testing;