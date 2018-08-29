var express = require('express');
var router = express.Router();
var db = require("../db");

/* GET users listing. */

router.get("/:discId", sendDiscussion);
router.post("/", postDiscussion);


function postDiscussion(req, res, next){
    const users = JSON.parse(req.body.participants);
    
    try {
		// On s'assure d'abord qu'il n'existe pas déja une discussion entre les deux 
		const discussionWithUsers = db.discussionExists(...users);
		const discussion = discussionWithUsers.length > 0 
						 	? discussionWithUsers[0] 
						 	: db.addDiscussion(...users);
	
		res.send(discussion);
	}
	catch(e){
    	console.log(e);
    	next(e);
  	}
}


function sendDiscussion(req, res, next){
	try {
		const id = parseInt(req.params.discId);
		const discussion = db.getDiscussion(id);

		res.send(discussion);
	}
	catch(e){
    	console.log(e);
    	next(e);
  	}
}


module.exports = router;
