const db = require("../db");

const addNotification = (req, res, next) => {
	try {
		const userId = req.params.id;
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
    	const userId = req.params.id;
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
    	const userId = req.params.id;
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


const sendUser = (req, res, next) =>{
	try {
    	const id = req.params.id;
    	const user = db.getUserById(id);

    	res.send(user);
  	}
  	catch(e){
    	console.log(e);
    	next(e);
  	}
}

const sendUserFriends = (req, res, next) => {
	try {
		const id = req.params.id;
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
		const id = req.params.id;
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
		const id = parseInt(req.params.id);
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
    sendUserActiveDiscussions,
    sendUserFriends,
    getNotifications,
    addNotification,
    deleteNotification
}