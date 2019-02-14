const User = require("../User");
const { isEqual } = require("lodash");
const debug = require("debug")("models:test.User");
const { quentin } = require("../../config/secret");



const userWithCompleteData = {
    "id": quentin.id,
    "firstname": "Quentin",
    "username": "Quentin",
    "gender": "M",
    "email": quentin.email,
    "lastname": "Sahal",
    "provider": "facebook",
    "profilepic": "/ppicture/gTQa8EmEdVl4orPkBPB5Wc82i4zlqLFD.jpg",
    "landscapePicture": "jTS41cwdpPRuAIB1KZSjF4Uw0j02R4Pt.jpg",
    "dob": {
        "date": "1991-10-06T06:34:44Z",
        "age": 27
    },
    "registered": {
        "date": "2015-11-04T22:09:36Z",
        "age": 3
    },
    "nat": "FR",
    "role": 100
}

const userWithMinRequiredData = {
    "id": quentin.id,
    "firstname": "Quentin",
    "username": "Quentin",
    "email": quentin.email,
    "lastname": "Sahal",
    "provider": "facebook",
    "profilepic": "/ppicture/gTQa8EmEdVl4orPkBPB5Wc82i4zlqLFD.jpg"
}

const userWithIncompleteData = {
    "id": quentin.id,
    "firstname": "Quentin",
    "username": "Quentin",
    "email": quentin.email,
    "lastname": "Sahal",
    "profilepic": "/ppicture/gTQa8EmEdVl4orPkBPB5Wc82i4zlqLFD.jpg"
}


const userWithIncorrectEntry = {
    ...userWithMinRequiredData,
    "email": quentin.email,
}


const toTest = {
    // userWithCompleteData, 
    // userWithIncompleteData, 
    //userWithIncorrectEntry, 
    userWithMinRequiredData
};



test.todo("Testing different working or not models")
// Object.entries(toTest).map(([key, objToTest]) => {
//     debug("Test for ",key);
//     try{
//         const u = new User(objToTest);
//         for (let ku of Object.keys(u)) {
//             debug(u[ku]);
//         }
//     }
//     catch(e){
//         debug(e);
//     }
    
// })