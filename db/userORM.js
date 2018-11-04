const { str, deepCopy } = require("../utils");

module.exports = (db) => {

    const getUserById = (userId) => {
        const data = db.get();
        const {users} = data;
        return (users.filter((usr) => str(usr.id) === str(userId) ))[0];
    }

    const getUserByMail = (email) => {
        const data = db.get();
        const { users } = data;
        return (users.filter((usr) => usr.email === email ))[0]
    }

    const addUser = (user) => {
        const data = db.get();
        const users  = deepCopy(data.users);

        if(getUserByMail(user.email)){
            debug("there is already a user matching that mail");
            return false;
        }

        users.push(user);

        db.set({
            ...data,
            users
        })
    }

    const getUserIndex = (userId) => {
        const data = db.get();
        return data.users.findIndex(user => userId = user.id);
    }

    const checkIfUserExists = (value, crit) => {
        const data = db.get();
        const { users } = data;

        return users.find(user => user[crit] === value);
    }

    // Peut etre devrait on verifier si l'utilisateur 
    // existe pour retourner une reponse plus precise
    const getUserFriends = (userId) => {
        const data = db.get();
        const friendships = data.friendships.filter(fsp => (
            str(fsp.friend1) === str(userId) || str(fsp.friend2) === str(userId)
        ))

        return friendships.map(fsp => {
            const friendId = fsp.friend1 === userId ? fsp.friend2 : fsp.friend1;
            return getUserById(friendId);
        })
    }


    const getUserActiveDiscussions = (userId) => {
        const id = str(userId);
        const data = db.get();
        const discussions = data.discussions.filter(disc => (str(disc.user1) === id || str(disc.user2) === id))

        return discussions.map(disc => {
            const withId = disc.user1 === id ? disc.user2 : disc.user1;
            const lastMessage = disc.content[disc.content.length-1];

            const msg = lastMessage ? recomposeMessage(lastMessage, data) :  "";

            return {
                id: disc.id,
                with: getUserById(withId),
                lastMessage: msg
            }
        })
    }


    const getUserDiscussions = (userId) => {
        const id = str(userId);
        const data = db.get();
        const discussions = data.discussions.filter(disc => (str(disc.user1) === id || str(disc.user2) === id))

        return discussions.map(disc => {
            const participants = {};
            participants[disc.user1] = getUserById(disc.user1);
            participants[disc.user2] = getUserById(disc.user2);

            disc.user1 = participants[disc.user1];
            disc.user2 = participants[disc.user2];

            disc.content.map(msg => {
                msg.from = participants[msg.from]["username"];
                msg.to = participants[msg.to]["username"];

                return msg;
            })

            return disc;
        })
    }

    const recomposeMessage = (msg, data) => {
        return {
            id: msg.id,
            from : msg.from,
            to : msg.to,
            date : msg.date,
            content: msg.content,
            state: data.messageState[msg.state]
        }
    }

    return {
        getUserById,
        getUserIndex,
        getUserFriends,
        getUserActiveDiscussions,
        getUserDiscussions,
        recomposeMessage,
        addUser,
        checkIfUserExists
    }

}