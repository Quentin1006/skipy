const { str, deepCopy } = require("../utils");
const comparator = require("../lib/comparator");
const User = require("../models/User");

module.exports = (db) => {

    // Get all the users matching all the selected filters
    const getUsers = (filters={}, compare=comparator) => {
        const data = db.get();
        const {users} = data;

        const filteredUsers = users.filter(usr => {
            return Object.keys(filters).every(crit => {
                const [
                    usrCrit, 
                    filtersCrit
                ] = crit.split(".")
                    .reduce((acc, key) => [acc[0][key], acc[1]], [usr, filters[crit]])

                return compare(usrCrit, filtersCrit);
            })
        })
        return filteredUsers.map(usr => new User(usr));
    }


    /** returns all the user whose name, lastname or both matches partially the text  */ 
    const getUsersByName = (text, opts) => {
        opts = {
            max:10,
            minLength:2,
            ...opts
        }

        if(text.length < opts.minLength){
            return [];
        }
            
        const data = db.get();
        const {users} = data;

        text= text.toLowerCase();
        const filteredUsers = []
        
        for(let usr of users){
            const fullname = `${usr.firstname} ${usr.lastname}`.toLowerCase();
            if(fullname.indexOf(text) > -1){
                filteredUsers.push(usr)
            }

            if(filteredUsers.length >= opts.max){
                break;
            }
        }
        return filteredUsers.map(usr => new User(usr))
    }


    const getUserById = (id) => {
        return getUsers({id})[0];
    }


    const getUserByMail = (email) => {
        return getUsers({email})[0];
    }


    const addUser = (user) => {
        const data = db.get();
        const users  = deepCopy(data.users);

        if(getUserByMail(user.email)){
            debug("there is already a user matching that mail");
            return false;
        }

        try {
            const newUser = User.validateUser(user)
            users.push(newUser);
            db.set({
                ...data,
                users
            });
    
            return new User(newUser);
        }
        catch(e){
            return e;
        }
        

        
    }


    const updateUser = (userId, fields) => {
        const data = db.get();
        let updatedUser = {};

        const users = data.users.map(user => {
            if(str(user.id) === str(userId)){
                updatedUser = User.validateUser({
                    ...user,
                    ...fields
                });
                return updatedUser;
            }
            return user;
        });

        db.set({
            ...data,
            users
        });

        return new User(updatedUser);

    }


    const getUserIndex = (userId) => {
        const data = db.get();
        const user = data.users.findIndex(user => userId === user.id);
        return new User(user)
    }


    const checkIfUserExists = (value, crit="id") => {
        return getUsers({[crit]: value})[0];
    }


    /** Peut etre devrait on verifier si l'utilisateur 
     * existe pour retourner une reponse plus precise
     * */ 
    const getUserFriends = (userId) => {
        userId = String(userId);
        const data = db.get();
        const { friendships } = data
        
        const userFriendsId = Object.keys(friendships).reduce((acc, fsp) => {
            const usersId = fsp.split('#');
            if(usersId.includes(userId)){
                const friendId = usersId.filter(id => id !== userId)[0];
                acc.push(friendId);
            }
            return acc;
        }, [])

        return userFriendsId.map(friendId => getUserById(friendId));
    }


    const _getUnreadMessages = (fromDiscContent, userId) => {
        const unreadMessages = {count:0};
        const contentLen = fromDiscContent.length;

        for(let i = contentLen - 1; i>= 0; i--){
            const mess = fromDiscContent[i];
            // Si c'est un message de l'user on passe au suivant
            if(str(userId) === str(mess.from))
                continue;

            if(mess.state < 2 ){
                unreadMessages.count++;
            }
            else {
                break;
            }
        }

        return unreadMessages.count;
    }


    const getUserActiveDiscussions = (userId) => {
        const id = str(userId);
        const data = db.get();
        const userDiscs = data.discussions.filter(disc => (str(disc.user1) === id || str(disc.user2) === id))

        const activeDiscs = userDiscs.map(disc => {
            const withId = disc.user1 === id ? disc.user2 : disc.user1;
            const lastMessage = disc.content[disc.content.length-1];

            // Get the number of unread messages
            const unreadMessagesCount = _getUnreadMessages(disc.content, id);
            const msg = lastMessage ? recomposeMessage(lastMessage, data) :  {};

            return {
                id: disc.id,
                with: getUserById(withId),
                lastMessage: msg,
                unreadMessagesCount,
                lastUpdate: msg.date
            }
        });

        return activeDiscs.sort((a, b) => b.lastUpdate > a.lastUpdate);

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
        getUserByMail,
        getUsers,
        getUsersByName,
        getUserIndex,
        getUserFriends,
        getUserActiveDiscussions,
        getUserDiscussions,
        recomposeMessage,
        addUser,
        updateUser,
        checkIfUserExists
    }

}