const path = require("path");
const fs = require("fs");
const pathToDb = path.resolve(__dirname, "data.json");

const notificationTesting = require("./helper.notifications"); // Need to redo the tests
const userTesting = require("./helper.users");
const discTesting = require("./helper.discussions");
const fshipTesting = require("./helper.friendships");

const testDbBranch = (description, fn, ...args) => {
    describe(description, () => {
        const copy = `${pathToDb}.copy`;

        beforeAll(() => {
            return new Promise((resolve, reject) => {
                fs.copyFile(pathToDb, copy, (err) => {
                    if(err) reject(err);
                    resolve();
                })
            })
        })
    
        afterAll(() => {
            return new Promise((resolve, reject) => {
                fs.unlink(pathToDb, err => {
                    if(err) reject(err);
                    fs.rename(copy, pathToDb, (err) => {
                        if(err) return reject(err);
                        resolve();
                    });
                });
            })
        })
    
        // test("path to db should be correct", () => {
        //     expect(pathToDb).toStrictEqual("D:\\CODE\\serverSkipy\\db\\test\\data.json")
        // })
    
        // test("copy of db should be created", () => {
        //     const copyToDBCreated = fs.existsSync(copy);
        //     expect(copyToDBCreated).toBeTruthy();
        // })
    
        fn(...args);
    })
} 

// Laisse la base de données intacte à la fin du test 
// quelque soit l'interaction
describe("Testing the DB", () => {
    //testDbBranch("Test Notification branch", notificationTesting, pathToDb); 
    testDbBranch("Test user branch", userTesting, pathToDb);
    testDbBranch("Test discussion branch", discTesting, pathToDb);
    testDbBranch("Test friendship branch", fshipTesting, pathToDb);
})

