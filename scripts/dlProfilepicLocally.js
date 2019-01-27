

const imgdl = require("../lib/imageDownloader");
const randomstring = require("randomstring");
const db = require("../db");
const data  = db.get();
const { users } = data; 

const dest = "D:/CODE/serverSkipy/upload/ppicture";

// to target only facebook ppicture
// s:\/\/platform-lookaside.fbsbx.com

let delay = 100;
const timeout = (ms) => {
    return new Promise(resolve => setTimeout(() => resolve(), ms));
}

(async () => {
    try {
        const usersWithLocalPicture = await Promise.all(
            users.map(async user => {
                const pp = user.profilepic || '';
                if(pp.match(/^http/)){
                    const imgName = randomstring.generate();

                    delay += 100;
                    await timeout(delay); // important to ease to server reached
                    await imgdl.downloadImage(pp, {
                        imgName,
                        dest,
                    })
                    return {
                        ...user,
                        profilepic: `/ppicture/${imgName}.jpg`
                    }
                }
                return user;
            })
        )

        db.set({
            ...data,
            users: usersWithLocalPicture
        })

        console.log("Work is Done");
        process.exit(0);
    }
    catch(e){
        console.log("during uploading the db", e);
    }

})()


