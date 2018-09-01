module.exports = (db) => {

    const getUserById = (userId) => {
        const data = db.get();
        const id = parseInt(userId);
        const users = data.users;
        return (users.filter((usr) => usr.id === id ))[0];
    }


    const getUserFriends = (userId) => {
        const data = db.get();
        const id = parseInt(userId);
        const friendships = data.friendships.filter(fsp => (fsp.friend1 === id || fsp.friend2 === id))

        return friendships.map(fsp => {
        const friendId = fsp.friend1 === userId ? fsp.friend2 : fsp.friend1;
        return getUserById(friendId);
        })
    }


    const getUserActiveDiscussions = (userId) => {
        const id = parseInt(userId);
        const data = db.get();
        const discussions = data.discussions.filter(disc => (disc.user1 === id || disc.user2 === id))

        return discussions.map(disc => {
            const withId = disc.user1 === userId ? disc.user2 : disc.user1;
            const lastMessage = disc.content[disc.content.length-1];

            return {
                id: disc.id,
                with: getUserById(withId),
                lastMessage: recomposeMessage(lastMessage, data)
            }
        })
    }


    const getUserDiscussions = (userId) => {
        const id = parseInt(userId);
        const data = db.get();
        const discussions = data.discussions.filter(disc => (disc.user1 === id || disc.user2 === id))

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
            from : getUserById(msg.from).username,
            to : getUserById(msg.to).username,
            date : msg.date,
            content: msg.content,
            state: data.messageState[msg.state]
        }
    }

    return {
        getUserById,
        getUserFriends,
        getUserActiveDiscussions,
        getUserDiscussions,
        recomposeMessage
    }

}