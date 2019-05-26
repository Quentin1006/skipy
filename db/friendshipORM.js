const Friendship = require("../models/Friendship");



module.exports = (db) => {

    const fsStatus = (db.get()).fsStatus;


    const getFsStatus = () => (fsStatus)


    const _getFriendships = () => {
        const data = db.get();
        const {friendships} = data;

        return friendships;
    } 


    const _updateFriendship = (newObj) => {
        const data = db.get();
        db.set({
            ...data,
            friendships: newObj
        })
    }


    checkFriendship = (u1, u2) => {
        const friendships = _getFriendships();
        return friendships[`${u1}#${u2}`] || friendships[`${u2}#${u1}`]
    }

    // return an array to include initBy when needed
    getFriendshipStatus = (u1, u2) => {
        if(u1 === u2){
            return  {status: Friendship.YOU };
        }

        const fship = checkFriendship(u1,u2);

        if(fship){
            // to know who can answer the pending request
            return {
                status: fsStatus[fship.status], 
                initBy: fship.initBy
            }
        }

        // just to return INEXISTANT
        return {
            status: fsStatus[fsStatus.INEXISTANT]
        };
    }


    const _canSendFriendRequest = (fship, userId, otherId) => {
        const fshipExists = !!fship;

        // Cant send a friend request to yourself 
        if(userId === otherId){
            return false;
        }

        // Friendship should not be PENDING or CONFIRMED
        if(fshipExists && (fship.status === fsStatus.PENDING || fship.status === fsStatus.CONFIRMED)){
            return false;
        }

        // If your request was declined you cant send a new one
        if(fshipExists && fship.status === fsStatus.DECLINED && userId === fship.initBy){
            return false;
        }
        return true;
    }


    const sendFriendRequest = (senderId, receiverId) => {
        const friendships = _getFriendships();
        let friendship = checkFriendship(senderId, receiverId);
        const fsId = `${senderId}#${receiverId}`;
        const newFriendship = !friendship;
        
        if(!_canSendFriendRequest(friendship, senderId, receiverId)){
            return {err: "ERR_NOT_ALLOWED"}
        }
        
        if(newFriendship){
            
            friendships[fsId] = new Friendship({
                senderId,
                receiverId,
                status: fsStatus.PENDING
            })
        }
        else {
            friendship.initBy = senderId;
            friendship.status = fsStatus.PENDING;
            friendship.since = Date.now()
        }

        _updateFriendship(friendships);

        friendship = newFriendship ? friendships[fsId] : friendship;
        // We set status to a readable string
        friendship.status = fsStatus[friendship.status]

        return {
            res: {
                receiverId,
                senderId,
                friendship
            }
        }
    }

    // Important to not mix senderId and receiverId to prevent 
    // sender from accepting the request he sent 
    const answerFriendRequest = (senderId, receiverId, accepted) => {
        const friendships = _getFriendships();
        const fship = checkFriendship(senderId, receiverId);
        const status = fship && fship.status;
        
        if(!status || status !== fsStatus.PENDING || fship.initBy !== senderId){
            return {err: "ERR_NOT_ALLOWED"}
        }

        fship.status = accepted ? fsStatus.CONFIRMED : fsStatus.DECLINED        
        _updateFriendship(friendships);

        const res = {
            accepted,
            senderId,
            receiverId,
            friendship: {
                ...fship,
                status: fsStatus[fship.status]
            }
        }

        return {res}
    }


    const acceptFriendRequest = (senderId, receiverId) => {
        return answerFriendRequest(senderId, receiverId, true);
    }


    const declineFriendRequest = (senderId, receiverId) => {
        return answerFriendRequest(senderId, receiverId, false);
    }

    const deleteFriendship = (userDeleting, userDeleted) => {
        const friendships = _getFriendships();

        const fsObj =  friendships[`${userDeleting}#${userDeleted}`] 
                    || friendships[`${userDeleted}#${userDeleting}`];

        if(!fsObj){
            return {err: "NO_FRIENDSHIP_TO_DELETE"}
        }

        if(fsObj && fsObj.status === fsStatus.DECLINED ){
            return {err: "FRIENDSHIP_DELETE_NOT_ALLOWED"}
        }

        delete friendships[`${userDeleting}#${userDeleted}`];
        delete friendships[`${userDeleted}#${userDeleting}`];

        _updateFriendship(friendships);

        return {res: {
            userDeleting, 
            userDeleted,
            friendship: {
                status: fsStatus[fsStatus.INEXISTANT]
            }
        }}
    }


    return {
        getFsStatus,
        checkFriendship,
        getFriendshipStatus,
        sendFriendRequest,
        answerFriendRequest,
        acceptFriendRequest,
        declineFriendRequest,
        deleteFriendship
    }
}