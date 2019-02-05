const debug= require("debug")("test:store");
const path = require("path");
const fs = require("fs");
const pathToDb = path.resolve(__dirname, "data.json");

const notificationTesting = require("./test.notifications"); // Need to redo the tests

const userTesting = require("./test.users");

const discTesting = require("./test.discussions");


// Laisse la base de données intacte à la fin du test 
// quelque soit l'interaction
const runDbTest = (pathToDb, testsFct, ...args) => {
    return new Promise((resolve, reject) => {
        const copy = `${pathToDb}.copy`;
        fs.copyFile(pathToDb, copy, (err) => {
            if(err) console.log(err);
            else {
                try {
                    testsFct(...args);
                }
                catch(e){console.log(e)}
                
            }
            fs.unlink(pathToDb, err => {
                if(err) reject(err);
                fs.rename(copy, pathToDb, (err) => {
                    if(err) return reject(err);
                    resolve();
                });
            });
            
        })
    })
    
}


runDbTest(pathToDb, userTesting, pathToDb)
.then(() => (
    runDbTest(pathToDb, discTesting, pathToDb)
))
// .then(() => (
//     runDbTest(pathToDb, notificationTesting, pathToDb) // Need to redo the tests
// ))
.then(() => {
    process.exit(0);
})