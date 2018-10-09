const db = require("../db");

const postMessage = (req, res, next) => {    
    try {
		const { from, to, content } = req.body;
		const discId = parseInt(req.params.discId);
		const message = db.addMessageToDiscussion(discId, {
			from : parseInt(from),
			to: parseInt(to),
			content
		});
		res.send(message);
	}
	catch(e){
    	console.log(e);
    	next(e);
  	}
}



const postDiscussion = (req, res, next) => {    
    try {
		const users = JSON.parse(req.body.participants);
		// On s'assure d'abord qu'il n'existe pas déja une discussion entre les deux 
		// On devrait tester aussi que les deux idUser existent aussi
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


const sendDiscussion = (req, res, next) => {
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


module.exports = {
    sendDiscussion,
    postDiscussion,
    postMessage

}