const fs = require('fs');
const pathToData = "D:/React/serverSkypey/db/data.json"; // A ecrire de manière plus souple

const get = () => JSON.parse(fs.readFileSync(pathToData, {encoding:'utf-8'}));

const set = (newDb) => fs.writeFileSync(pathToData, JSON.stringify(newDb));


const db = {
    get, 
    set,
}

module.exports = Object.assign(
    {}, 
    require("./userORM")(db), 
    require("./discussionORM")(db)
);



 