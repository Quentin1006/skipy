const fs = require('fs');
const pathToData = "D:/CODE/serverSkipy/db/data.json"; // A ecrire de manière plus souple
const readJSON = (path) => JSON.parse(fs.readFileSync(path, {encoding:'utf-8'}));
const writeJSON = (path, data) => fs.writeFileSync(path, JSON.stringify(data));
const combineORMs = (...arrayOfORM) => Object.assign({}, ...arrayOfORM);

const get = () => data;

const set = (newDb) => {
    writeJSON(pathToData, data)
    data = readJSON(pathToData);
}

let data = readJSON(pathToData);


const db = {
    get, 
    set,
}

// On insère tous les ORM ici
module.exports = combineORMs(
    require("./userORM")(db), 
    require("./discussionORM")(db),
    require("./notificationORM")(db)
);



 