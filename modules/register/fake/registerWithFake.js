const getSessions = () => {
    throw(new Error("You have to implement the function getSessions"));
}


const getUserById = (id) => {
    throw(new Error("You have to implement the function getUserById"));
}

const _getAvailableFakeId = (sessions, nbAvailable) => {
    return new Promise((resolve, reject) => {
        let idx = 0;
        const fakeIdInUse = sessions.reduce((acc, {user={}}) => {
            if(user.provider === "fake"){
                acc[user.id] = true;
            }   
            return acc;
        }, {});
        while(fakeIdInUse[idx] && idx < nbAvailable) idx++;
        return idx >= nbAvailable 
                ? reject({error: "All fake sessions are in use"})
                : resolve(idx) ;  
    }) 
}


module.exports = ({maxAvailableSessions}) => {
    this.getSessions = getSessions;
    this.getUserById = getUserById;

    const use = (fctName, fct) => {
        this[fctName] = fct;
        return 0;
    }

    const registerWithFake = async (auth_infos) => {
        try{
            const sessions = await this.getSessions();
            const userId  = await _getAvailableFakeId(sessions, maxAvailableSessions);
            const user = this.getUserById(userId);

            return {
                user,
                isFake: true
            }

        }
        catch(err){
            return err;
        }
    }

    return Object.seal({
        use,
        registerWithFake
    })
}