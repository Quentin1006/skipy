const Joi = require("joi");

const FriendshipSchema = Joi.object().keys({
    user1Id: Joi.string().alphanum().required(),
    user2Id: Joi.string().alphanum().invalid(Joi.ref('user1Id')).required(),
    status: Joi.number().required(),
    initBy: Joi.string().allow([Joi.ref('user1Id'), Joi.ref('user2Id')]),
    since: Joi.date().timestamp(),
    relType: Joi.number().required()
})


class Friendship {
    constructor({senderId, receiverId, status, relType=-1}){
        const friendship = Friendship.validateFriendship({
            user1Id: senderId,
            user2Id: receiverId,
            initBy: senderId,
            status,
            relType,
            since: Date.now(),
        });

        Object.keys(friendship).map(key => {
            this[key] = friendship[key]
        });
    }



    static validateFriendship(obj){
        const { error, value } = Joi.validate(obj, FriendshipSchema);
        if(error)
            throw error;

        return value;
    }
}


Friendship.YOU = "YOU";

module.exports = Friendship;