const db = require("../db");


const getUserId = (req) => (req.params.id === "me" ? req.user.id : req.params.id)


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
    	const user = db.updateUser(id, fields);

    	res.send(user);
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

module.exports = {
    sendUserDiscussions,
	sendUser,
	updateUser,
    sendUserActiveDiscussions,
    sendUserFriends,
    getNotifications,
    addNotification,
    deleteNotification
}