const Joi = require("joi");
const { hostname, protocol } = require("../config");
const defaultProfilepicPath = "/ppicture/random.jpg";
const defaultLandscapePicturePath = "/laquent_landscape.jpg";
const userRole = 10;


const DatebSchema = Joi.object().keys({
    date: Joi.string().isoDate(),
    age: Joi.number()
})

const UserSchema = Joi.object().keys({
    id: Joi.string().alphanum().required(),
    firstname: Joi.string().min(3).max(30).required(),
    lastname: Joi.string().min(3).max(100).required(),
    username: Joi.string().alphanum().min(3).max(30),
    gender: Joi.string(),
    email: Joi.string().email({ minDomainAtoms: 2 }).required(),
    dob: DatebSchema,
    registered: DatebSchema,
    picture: Joi.object(),
    profilepic: Joi.string()
                    .uri({allowRelative: true})
                    .default(defaultProfilepicPath)
                    .required(),
    landscapePicture: Joi.string()
                    .uri({allowRelative: true})
                    .default(defaultLandscapePicturePath),
    role: Joi.number().default(userRole),
    provider: Joi.string().required(),
    nat: Joi.string().max(30)  
})

/**
 * The purpose of this class is to validate the structure of the model
 * By using the static method valdate user before adding it to the db
 * And use the constructor before sending it to the client
 */
class User {
    constructor(userObj){
        const user = User.validateUser(userObj);
        Object.keys(user).map(info => {
            this[info] = user[info]
        });

        ["profilepic", "landscapePicture"].map(pic => {
            this._addDomainToPic(pic);
        })
        

        this._addDomainToPic = this._addDomainToPic.bind(this)

    }


    static validateUser(obj){
        const { error, value } = Joi.validate(obj, UserSchema);
        if(error)
            throw error;

        return value;
    }


     _addDomainToPic(picturePath){
        if(!this[picturePath].match(/^http/)){
            const p = (hostname +"/"+this[picturePath]).replace(/\/\//g, "/");
            this[picturePath] = protocol + "://" + p
        }
    }
}

module.exports = User;