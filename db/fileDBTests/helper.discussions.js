const debug= require("debug")("test:discussions");


const Store = require("../store");
const discussionORM = require("../discussionORM");


const testing = (pathToDb) => {

    const db = new Store(pathToDb, [
        discussionORM
    ])


    const gontranId = require("../../config/secret").gontran.id;

    describe("Testing the autocomplete for the recipient search", () => {
        test("Should work when entering the firstname", () => {
            const sugg = db.getMatchingSuggestions(gontranId, "Andrea", 3);
            expect(sugg).toHaveLength(2);
            expect(sugg[0]).toHaveProperty("id", "1");
            expect(sugg[1]).toHaveProperty("id", "108")
        })


        test("Should work when entering the lastname", () => {
            const sugg = db.getMatchingSuggestions(gontranId, "Nielsen", 3);
            expect(sugg).toHaveLength(3);
            expect(sugg[0]).toHaveProperty("id", "46");
            expect(sugg[1]).toHaveProperty("id", "108");
            expect(sugg[2]).toHaveProperty("id", "341")
        })

        test("Should work when entering fullname", () => {
            const sugg = db.getMatchingSuggestions(gontranId, "Andrea Niel", 3);
            expect(sugg).toHaveLength(1);
            expect(sugg[0]).toHaveProperty("id", "108");
        })

        test("Should work when no suggestions available", () => {
            const emptySugg = db.getMatchingSuggestions(gontranId, "Xk", 2);
            expect(emptySugg).toHaveLength(0);
        })

        describe("Should return a number of suggestions in accordance with the max desired", () => {
            test("When less result than max allowed", () => {
                const bigMaxAlllowed = 10;
                expect(db.getMatchingSuggestions(gontranId, "Ca", bigMaxAlllowed).length).toBeLessThanOrEqual(bigMaxAlllowed);
                
            })

            test("When more result than max allowed", () => {
                const lowMaxAllowed = 2;
                expect(db.getMatchingSuggestions(gontranId, "Ca", 2).length).toBeLessThanOrEqual(lowMaxAllowed);
            })
        })

        test("Should work when empty search", () => {
            const emptySearch = db.getMatchingSuggestions(gontranId, "", 2);
            expect(emptySearch).toHaveLength(0);
        })
    })
};


module.exports = testing;