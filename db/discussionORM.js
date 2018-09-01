module.exports = (db) => {

    const User = require("./userORM")(db);

    const recomposeMessage = (msg) => {
        return {
            from : this.getUserById(msg.from).username,
            to : this.getUserById(msg.to).username,
            date : msg.date,
            content: msg.content,
            state: db.messageState[msg.state]
        }
    }

    const getDiscussion = (discId) => {
        const id = parseInt(discId);
        const data = db.get();
        const discussion = data.discussions.filter(disc => (id === disc.id))[0];

        return {
            user1: User.getUserById(discussion.user1),
            user2: User.getUserById(discussion.user2),
            content: discussion.content.map(msg => User.recomposeMessage(msg, data))
        }
    };


    const discussionExists = (user1, user2) => {
        const joinedUsers = user1+ "" +user2;
        const reverseJoinedUsers = user2+ "" + user1;

        const discussions = db.get().discussions;

        return discussions.filter((disc) => {
            const joinedDiscUsers = disc.user1 +""+ disc.user2;
            return (joinedDiscUsers === joinedUsers || joinedDiscUsers === reverseJoinedUsers)
        });
    }


    const addDiscussion = (user1, user2) => {
        const data = db.get();
        const discussions = data.discussions.slice(0);
        const newId = discussions[discussions.length - 1].id + 1;
        const discussion = {
            id: newId,
            user1,
            user2,
            content: []
        }

        discussions.push(discussion);

        db.set({ 
            ...data,
            discussions

        });

        return discussion;
    };


    // Il faudrait ajouter un traitement de l'erreur 
    // au cas ou le msg n'a pas pu etre ajouté
    // On devrait aussi vérifier que les participants correspondent bien a la discussion
    const addMessageToDiscussion = (discId, msg) => {
        const data = db.get();
        
        // we complete the msg obj before adding it to the db
        msg.date = Date.now();
        msg.state = 1; // On devrait mettre une CONSTANTE a la place de ce chiffre

        const discussionFromDb = JSON.parse(JSON.stringify(data.discussions));
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

    return {
        getDiscussion,
        discussionExists,
        addDiscussion,
        addMessageToDiscussion
    }
}