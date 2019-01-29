const Joi = require("joi");
const { join } = require("path")
const { hostname, protocol } = require("../config");
const defaultProfilepicPath = "/ppicture/random.jpg";
const defaultLadnscapePicturePath = "/laquent_landscape.jpg";
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
                    .default(defaultLadnscapePicturePath),
    role: Joi.number().default(userRole),
    provider: Joi.string().required(),
    nat: Joi.string().max(30)  
})

class User {
    constructor(userObj){
        const user = User.validateUser(userObj);
        Object.keys(user).map(info => {
            this[info] = user[info]
        });
        this._addDomainToProfilepic();

    }


    static validateUser(obj){
        const { error, value } = Joi.validate(obj, UserSchema);
        if(error)
            throw error;

        return value;
    }



    _addDomainToProfilepic(){
        if(!this.profilepic.match(/^http/)){
            this.profilepic = protocol + "://" + join(hostname, this.profilepic);
        }
    }
}

module.exports = User;