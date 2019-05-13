const db = require("../db");
const uniqid = require("uniqid");
const path = require("path");
const uploadFolder = "D:/CODE/serverSkipy/upload";


const getUserId = (req) => (req.params.id === "me" ? req.user.id : req.params.id);

const mimeToExt = {"image/jpeg":".jpg", "image/png":".png", "image/gif":".gif"}

const _handleUpload = (fieldname, upload={}, acceptedMimetypes=mimeToExt) => {
	if(Object.keys(acceptedMimetypes).indexOf(upload.mimetype) < 0) return false;
	const name = uniqid();
	const ext= acceptedMimetypes[upload.mimetype];
	const path_ = `/${fieldname}/${name}${ext}`;

	return path_;
} 

const getUploadPaths = (uploads) => {
	return Object.keys(uploads || []).reduce((acc, fieldname) => {
		const upload = uploads[fieldname]
		return {
			...acc,
			[fieldname]: _handleUpload(fieldname, upload)
		}
	}, {})
	
}

const _copyToUploadFolder = (uploadPaths, uploads) => {
	return Promise.all(
		Object.entries(uploadPaths).map(([fieldname, fileUpload]) => {
			const upload = uploads[fieldname];

			return new Promise((resolve, reject) => {
				upload.mv(uploadFolder+fileUpload, (err) => {
					if(err) return reject(err);
					return resolve();
				})
			})
			
		})
	)
}



const addNotification = (req, res, next) => {
	try {
		const userId = getUserId(req);
		const notif = JSON.parse(req.body.notif);

		const addedNotif = db.createNotification(userId, notif);
		const outcome = !!addedNotif ? "success" : "failure";

		res.send(outcome);
	}

	catch(e){
		console.log(e);
    	next(e);
  	}

}

const getNotifications = (req, res, next) => {
	try {
    	const userId = getUserId(req);
    	const notifs = db.getUserNotifications(userId);

    	res.send(notifs);
  	}
  	catch(e){
    	console.log(e);
    	next(e);
  	}
}

const deleteNotification = (req, res, next) => {
	try {
    	const userId = getUserId(req);
		const notifId = parseInt(req.params.notifId);
		
		const deletedNotif = db.deleteNotification(userId, notifId);

		const outcome = !!deletedNotif ? "success" : "failure";

    	res.send(outcome);
  	}
  	catch(e){
    	console.log(e);
    	next(e);
  	}
}


const sendUser = (req, res, next) => {
	try {
    	const id = getUserId(req);
    	const user = db.getUserById(id);

    	res.send(user);
  	}
  	catch(e){
    	console.log(e);
    	next(e);
  	}
}



const updateUser = (req, res, next) => {
	try {
		const id = getUserId(req);
		const fields = req.body;

		const uploadPaths = getUploadPaths(req.files)
		
		_copyToUploadFolder(uploadPaths, req.files)
		.then(() => {
			const user = db.updateUser(id, {...fields, ...uploadPaths});
			req.session.user = user;
			req.session.save();
			res.send(user);
		})

    	
  	}
  	catch(e){
    	console.log(e);
    	next(e);
  	}
}

const sendUserFriends = (req, res, next) => {
	try {
		const id = getUserId(req);
		const friendships = db.getUserFriends(id);

		res.send(friendships);
	}
	catch(e){
    	console.log(e);
    	next(e);
  	}
}

const sendUserActiveDiscussions = (req, res, next) => {
	try {
		const id = getUserId(req);
		const activeDiscussions = db.getUserActiveDiscussions(id);

		res.send(activeDiscussions);
	}
	catch(e){
    	console.log(e);
    	next(e);
  	}
}


const sendUserDiscussions = (req, res, next) => {
	try {
		const id = parseInt(getUserId(req));
		const discussions = db.getUserActiveDiscussions(id);

		res.send(discussions);
	}
	catch(e){
    	console.log(e);
    	next(e);
  	}
}



const checkFriendship = (req, res, next) => {
	try {
		const id = getUserId(req);
		const personId = req.params.personId // id of the other we wanna check the fship with
		
		const isFriendship = db.checkFriendship(id, personId);

		res.send(isFriendship);
	}
	catch(e){
    	console.log(e);
    	next(e);
  	}
}

module.exports = {
	checkFriendship,
    sendUserDiscussions,
	sendUser,
	updateUser,
    sendUserActiveDiscussions,
    sendUserFriends,
    getNotifications,
    addNotification,
    deleteNotification
}