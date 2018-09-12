const db = require("../../../db");
const FBO = require("./FBOauth");

exports.authenticateWithFB = async (auth_infos) => {
    let token = auth_infos.access_token
    if(auth_infos.auth_type === "code"){
        await FBO.getAccessTokenFromCode(auth_infos.code, auth_infos.redirect_uri)
            .then((res) => token = res.access_token)
            .catch((err) => { throw(err)});
    }
    return FBO.getUserFBdata(token)
        .then(user => {
            const { email } = user;
            const existingUser = db.checkIfUserExists(email, "email");

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
                    db.addUser(userToAdd);
                    
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

