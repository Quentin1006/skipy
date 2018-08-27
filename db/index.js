const fs = require('fs');
const pathToData = "D:/React/serverSkypey/db/data.json"; // A ecrire de manière plus souple

const db = JSON.parse(fs.readFileSync(pathToData, {encoding:'utf-8'}));

const recomposeMessage = (msg) => {
    return {
        from : this.getUserById(msg.from).username,
        to : this.getUserById(msg.to).username,
        date : msg.date,
        content: msg.content,
        state: db.messageState[msg.state]
    }
}


exports.get = () => db;


////// USER ACTIONS /////
exports.getUserById = (userId) => {
    const id = parseInt(userId);
    const users = db.users;
    return (users.filter((usr) => usr.id === id ))[0];
}


exports.getUserFriends = (userId) => {
    const id = parseInt(userId);
    const friendships = db.friendships.filter(fsp => (fsp.friend1 === id || fsp.friend2 === id))

    return friendships.map(fsp => {
       const friendId = fsp.friend1 === userId ? fsp.friend2 : fsp.friend1;
       return this.getUserById(friendId);
    })
}

exports.getUserActiveDiscussions = (userId) => {
    const id = parseInt(userId);
    const discussions = db.discussions.filter(disc => (disc.user1 === id || disc.user2 === id))

    return discussions.map(disc => {
        const withId = disc.user1 === userId ? disc.user2 : disc.user1;

        return {
            id: disc.id,
            with: this.getUserById(withId),
            lastMessage: recomposeMessage(disc.content[disc.content.length-1])
        }
    })
}


exports.getDiscussion = (discId) => {
    const id = parseInt(discId);
    const discussion = db.discussions.filter(disc => (id === disc.id))[0];

    return {
        user1: this.getUserById(discussion.user1),
        user2: this.getUserById(discussion.user2),
        content: discussion.content.map(msg => recomposeMessage(msg))
    }
}


exports.getUserDiscussions = (userId) => {
    const id = parseInt(userId);
    const discussions = db.discussions.filter(disc => (disc.user1 === id || disc.user2 === id))

    return discussions.map(disc => {
        const participants = {};
        participants[disc.user1] = this.getUserById(disc.user1);
        participants[disc.user2] = this.getUserById(disc.user2);

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



