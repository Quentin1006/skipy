const { deepCopy, str } = require("../utils");
const { deburr } = require("lodash");
const debug = require("debug")("orm:discussion");
const uniqid = require('uniqid');

module.exports = (db) => {

    const User = require("./userORM")(db);

    const recomposeMessage = (msg) => {
        return {
            id: msg.id,
            from : msg.from,
            to : msg.to,
            date : msg.date,
            content: msg.content,
            uploads: msg.uploads || [],
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
            id: discussion.id,
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


    const addDiscussionIfNotExist = (user1, user2) => {
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
            debug("No discussion with this id ", discId);
            return false;
        }



        if(!discUsersMatchMsgUsers(disc, msg)){
            debug("Discussion participants doesnt match msg participants");
            return false;
        }

        
            
        let builtMsg = {};
        const data = db.get();
        
        // we complete the msg obj before adding it to the db
        msg.date = Date.now();
        msg.state = 1; // On devrait mettre une CONSTANTE a la place de ce chiffre

        const discussionFromDb = deepCopy(data.discussions);
        const discussions = discussionFromDb.map((disc) => {
            if(disc.id === discId){
                const { content } = disc;
                const currentId = content.length > 0 && content[content.length - 1].id;
                const id =  (currentId !== undefined) ? currentId + 1 : 0;
                msg.id = id;

                const uid = uniqid();
                const uploads = msg.uploads.length > 0
                                ? msg.uploads.map(({id,size, type, preview}) => ({
                                    id: `${id}-${uid}`,
                                    name: `upload-${id}-${uid}`, 
                                    size,
                                    type,
                                    src: preview
                                }))
                                : [];
                
                builtMsg = {
                    ...msg,
                    uploads
                }
                disc.content.push(builtMsg);


            }
            return disc;
        });

        db.set({ 
            ...data,
            discussions

        });

        return builtMsg;

    }

    const setAllDiscussionsMessagesAsRead = (discId, userId) => {
        const data = db.get();
        const currentDiscussions = data.discussions;


        const discussions = currentDiscussions.map(disc => {
            if(str(disc.id) === str(discId)){
                disc.content.map(msg => {
                    if(str(userId) === str(msg.to))
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

    const _isUserFriend = (id, friendsId) => {
        return friendsId.indexOf(id) >= 0;
    }

    const _simplifyValue = (value) => {
        return deburr(value.trim()).toLowerCase();
    }

    const _matchSuggestion = (user, value) => {
        const firstname = _simplifyValue(user.firstname);
        const lastname = _simplifyValue(user.lastname);
        const sanitizedValue = _simplifyValue(value);
        const fullname = `${firstname} ${lastname}`;

        const regex = new RegExp(`^${sanitizedValue}`);

        return [firstname, lastname, fullname].some(name => name.search(regex) >= 0);
    }


    const getMatchingSuggestions = (id, value, nbToReturn) => {
        if(value.length === 0){
            return [];
        }

        const { friendships, users } = db.get();
        const idStr = str(id);
        const userFriendsId = [];
        const suggestions = [];

        let suggestionsFound = 0;

        for (fship of friendships){
            const f1 = str(fship.friend1);
            const f2 = str(fship.friend2);

            if(f1 === idStr)
                userFriendsId.push(f2);

            if(f2 === idStr)
                userFriendsId.push(f1);
        }
        
        for(user of users) {
            // We got the count, no need to go further
            if(suggestionsFound >= nbToReturn){
                break;
            } 

            if(!_matchSuggestion(user, value)){
               continue;
            }

            if(_isUserFriend(str(user.id), userFriendsId)){
                suggestions.push(user);
                suggestionsFound++;
            }
        }

        return suggestions;

    }

    return {
        getDiscussion,
        discussionExists,
        addDiscussionIfNotExist,
        addMessageToDiscussion,
        setAllDiscussionsMessagesAsRead,
        getMatchingSuggestions
    }
}