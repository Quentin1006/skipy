var express = require('express');
var router = express.Router();
var db = require("../db");

/* GET users listing. */

router.get('/:id', sendUser);
router.get("/:id/friends", sendUserFriends);
router.get("/:id/activeDiscussions", sendUserActiveDiscussions);




function sendUser(req, res, next){
	try {
    	const id = parseInt(req.params.id);
    	const user = db.getUserById(id);

    	res.send(user);
  	}
  	catch(e){
    	console.log(e);
    	next(e);
  	}
}

function sendUserFriends(req, res, next){
	try {
		const id = parseInt(req.params.id);
		const friendships = db.getUserFriends(id);

		res.send(friendships);
	}
	catch(e){
    	console.log(e);
    	next(e);
  	}
}

function sendUserActiveDiscussions(req, res, next){
	try {
		const id = parseInt(req.params.id);
		const activeDiscussions = db.getUserActiveDiscussions(id);

		res.send(activeDiscussions);
	}
	catch(e){
    	console.log(e);
    	next(e);
  	}
}


function sendUserDiscussions(req, res, next){
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


module.exports = router;
