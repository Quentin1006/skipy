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


    getFriendshipStatus = (u1, u2) => {
        if(u1 === u2){
            return Friendship.YOU;
        }

        const fship = checkFriendship(u1,u2);
        if(fship){
            return fsStatus[fship.status];
        }

        // just to return INEXISTANT
        return fsStatus[fsStatus.INEXISTANT];
    }





    const sendFriendRequest = (senderId, receiverId) => {
        const friendships = _getFriendships();
        const fship = _findFriendship(senderId, receiverId);
        const fshipExists = !!fship
        
        
        if(fshipExists && fship.status !== fsStatus.INEXISTANT){
            return {err: "ERR_NOT_ALLOWED"}
        }
        
        friendships[`${senderId}#${receiverId}`] = new Friendship({
            senderId,
            receiverId,
            status: fsStatus.PENDING
        })

        _updateFriendship(friendships);
        return {success: true}
    }


    const _handleFriendRequest = ({
        senderId, 
        receiverId, 
        isAcceptable, 
        nextStatus,
    }) => {
        const { friendships } = _getFriendships();
        const fsId = `${senderId}#${receiverId}`;
        const friendship = friendships[fsId]
        const status = friendship && fsStatus( friendship.status );

        
        if(status && !isAcceptable(status)){
            return {err: "ERR_NOT_ALLOWED"}
        }

        let found = false;
        const newFriendships = Object.keys(friendships).map(id => {
            if(id !== fsId){
                return friendships[id]; 
            }

            found = true;
            return new Friendship({
                senderId,
                receiverId,
                status: nextStatus
            })
        })

        if(!found){
            newFriendships[fsId] = new Friendship({
                senderId,
                receiverId,
                status: nextStatus
            })
        }
        
        _updateFriendship(newFriendships);
        return {success: true}

    }


    const answerFriendRequest = (senderId, receiverId, accepted) => {
        // const isAcceptable = status => status === fsStatus.INEXISTANT;
        // const nextStatus = accepted ? fsStatus.CONFIRMED : fsStatus.DECLINED

        // _handleFriendRequest({
        //     senderId,
        //     receiverId,
        //     isAcceptable,
        //     nextStatus,
        // })
                
        const friendships = _getFriendships();
        const fsId = `${senderId}#${receiverId}`;
        const fship = friendships[fsId];
        const status = fship && fship.status;
        
        if(!status || status !== fsStatus.PENDING){
            return {err: "ERR_NOT_ALLOWED"}
        }

        friendships[fsId].status = accepted ? fsStatus.CONFIRMED : fsStatus.DECLINED

        // const newFriendships = Object.keys(friendships).map(id => {
        //     if(id !== fsId){
        //         return friendships[id]; 
        //     }

        //     return new Friendship({
        //         senderId,
        //         receiverId,
        //         status: accepted ? fsStatus.CONFIRMED : fsStatus.DECLINED
        //     })
        // })
        
        _updateFriendship(friendships)
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

        delete friendships[`${userDeleting}#${userDeleted}`];
        delete friendships[`${userDeleted}#${userDeleting}`];

        _updateFriendship(friendships);

        return {success: true}
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