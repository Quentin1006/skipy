const { deepCopy, str } = require("../utils");
const debug = require("debug")("orm:discussion");

module.exports = (db) => {

    const User = require("./userORM")(db);

    const recomposeMessage = (msg) => {
        return {
            from : User.getUserById(msg.from).username,
            to : User.getUserById(msg.to).username,
            date : msg.date,
            content: msg.content,
            state: db.get().messageState[msg.state]
        }
    }

    const getDiscussion = (discId) => {
        const data = db.get();
        const discussion = data.discussions.filter(disc => (str(discId) === str(disc.id)))[0];

        if(!discussion){
            debug("No discussion with this id", discId);
            return {};
        }

        return {
            user1: User.getUserById(discussion.user1),
            user2: User.getUserById(discussion.user2),
            content: discussion.content.map(msg => recomposeMessage(msg, data))
        }
    };


    const discussionExists = (user1, user2) => {
        const joinedUsers = user1+ "" +user2;
        const reverseJoinedUsers = user2+ "" + user1;

        const discussions = db.get().discussions;

        return (discussions.filter((disc) => {
            const joinedDiscUsers = disc.user1 +""+ disc.user2;
            return (joinedDiscUsers === joinedUsers || joinedDiscUsers === reverseJoinedUsers)
        }))[0];
    }


    const addDiscussion = (user1, user2) => {
        // si la discussion existe déja on la retourne et on s'arrete la 
        const disc = discussionExists(user1, user2) || {};
        if(disc.id){
            debug("discussion already exists");
            return disc;
        }
            

        const data = db.get();
        const discussions = data.discussions.slice(0);
        const newId = discussions[discussions.length - 1].id + 1;
        const discussion = {
            id: newId,
            user1,
            user2,
            content: []
        }
        debug("discussion created", discussion);

        discussions.push(discussion);

        db.set({ 
            ...data,
            discussions

        });

        return discussion;
    };

    // helper function to verify that message can be added to the discussion
    const discUsersMatchMsgUsers = (disc, msg) => {
        const joinedMsgUsers = msg.from+ "" +msg.to;
        const reverseJoinedMsgUsers = msg.to+ "" + msg.from;

        const joinedDiscUsers = disc.user1.id +""+ disc.user2.id;
        return (joinedDiscUsers === joinedMsgUsers || joinedDiscUsers === reverseJoinedMsgUsers)
    }


    // Il faudrait ajouter un traitement de l'erreur 
    // au cas ou le msg n'a pas pu etre ajouté
    // On devrait aussi vérifier que les participants correspondent bien a la discussion
    const addMessageToDiscussion = (discId, msg) => {
        // La discussion n'existe pas;
        const disc = getDiscussion(discId);
        if(!disc){
            debug("No discussion with thisid ", discId);
            return false;
        }

        if(!discUsersMatchMsgUsers(disc, msg)){
            debug("Discussion participants doesnt match msg participants");
            return false;
        }
            

        const data = db.get();
        
        // we complete the msg obj before adding it to the db
        msg.date = Date.now();
        msg.state = 1; // On devrait mettre une CONSTANTE a la place de ce chiffre

        const discussionFromDb = deepCopy(data.discussions);
        const discussions = discussionFromDb.map((disc) => {
            disc.id === discId && disc.content.push(msg);
            return disc;
        });

        db.set({ 
            ...data,
            discussions

        });

        return msg;

    }

    const setAllDiscussionsMessagesAsRead = (discId) => {
        const data = db.get();
        const discussionsCopy = deepCopy(data.discussions);

        const discussions = discussionsCopy.map(disc => {
            if(str(disc.id) === str(discId)){
                disc.content.map(msg => {
                    msg.state = 2;
                    return msg;
                })
            }
            return disc
        }) 

        db.set({ 
            ...data,
            discussions

        });
        
        return true;

    }

    return {
        getDiscussion,
        discussionExists,
        addDiscussion,
        addMessageToDiscussion,
        setAllDiscussionsMessagesAsRead
    }
}