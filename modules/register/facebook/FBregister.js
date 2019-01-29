const FacebookOauth = require("../../../lib/OAuth/facebook/FBOauth");
const User = require("../../../models/User");


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

        let token = "";
        if(auth_infos.auth_type === "code"){
            await FBO.getAccessTokenFromCode(auth_infos.code, auth_infos.redirect_uri)
                .then((res) => token = res.access_token)
                .catch((err) => { throw(err)});
        }
        // On a directement le token depuis le client
        else {
            token = auth_infos.token_or_code;
        }

        return FBO.getUserFBdata(token)
            .then(user => {
                const { email } = user;
                const existingUser = this.checkIfUserExists(email, "email");
    
                if(!existingUser) {
                    const userToAdd = new User({
                        id: `fb${user.id}`,
                        firstname: user.first_name,
                        username: user.first_name,
                        email: user.email,
                        lastname: user.last_name,
                        provider: auth_infos.provider,
                        profilepic: user.picture.data.url,
                        registered: {
                            date: Date.now(),
                            age: 0
                        },
                        role: 10
                    })
                    this.addUser(userToAdd);
                    
                    return {
                        user: userToAdd,
                        token,
                        just_registered: true
                    };
                }
                else {
                    return {
                        user: new User(existingUser),
                        token  
                    }
                }
            })
            .catch((err) => { 
                return {
                    ...err,
                    error: "FB OAuth error"
                }
            })
    }


    return Object.seal({
        registerWithFB,
        use

    })
}


