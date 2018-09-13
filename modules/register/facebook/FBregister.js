const FacebookOauth = require("lib/Oauth/facebook/FBOauth")


const checkIfUserExists = () => {
    throw(new Error("You have to implement the function checkIfUserExists"));
}

const addUser = () => {
    throw(new Error("You have to implement the function addUser"));
};

module.exports = (FBoauthCreds) => {
    const FBO = FacebookOauth(FBoauthCreds);

    this.checkIfUserExists = checkIfUserExists;
    this.addUser = addUser;

    const use = (fctName, fct) => {
        this[fctName] = fct;
    }

    const registerWithFB = async (auth_infos) => {

        let token = auth_infos.access_token
        if(auth_infos.auth_type === "code"){
            await FBO.getAccessTokenFromCode(auth_infos.code, auth_infos.redirect_uri)
                .then((res) => token = res.access_token)
                .catch((err) => { throw(err)});
        }

        return FBO.getUserFBdata(token)
            .then(user => {
                const { email } = user;
                const existingUser = this.checkIfUserExists(email, "email");
    
                if(!existingUser) {
                        const userToAdd = {
                            id: `fb${user.id}`,
                            firstname: user.first_name,
                            username: user.first_name,
                            email: user.email,
                            lastname: user.last_name,
                            provider: auth_infos.provider,
                            token: token,
                            profilepicture: user.picture.data.url,
                            status:"",
                            notifications: []
                        }
                        this.addUser(userToAdd);
                        
                        return {
                            ...userToAdd,
                            just_registered: true
                        };
                }
                else {
                    return existingUser;
                }
            })
            .catch((err) => { console.log(err)});
    }


    return Object.seal({
        registerWithFB,
        use

    })
}

