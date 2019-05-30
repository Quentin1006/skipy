const Joi = require("joi");
const uniqid = require("uniqid");

const NotificationSchema = Joi.object().keys({
    id: Joi.string().alphanum().required(),
    from: Joi.string().alphanum().required(),
    to: Joi.string().alphanum().invalid(Joi.ref('from')).required(),
    content: Joi.string().required(),
    seen: Joi.boolean(),
    date: Joi.date().timestamp().required(),
    type: Joi.string()
})


class Notification {
    constructor({from, to, content}){
        const notification = Notification.validateNotification({
            id: uniqid(),
            from,
            to,
            content,
            seen: false,
            date: Date.now(),
        });

        Object.keys(notification).map(key => {
            this[key] = notification[key]
        });
    }


    static validateNotification(obj){
        const { error, value } = Joi.validate(obj, NotificationSchema);
        if(error)
            throw error;

        return value;
    }
}

module.exports = Notification;