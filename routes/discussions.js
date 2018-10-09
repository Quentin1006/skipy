const express = require('express');
const router = express.Router();
const discsCtrl = require("../controllers/discussionsCtrl");


// DISCUSSIONS ROUTES
router.get("/:discId", discsCtrl.sendDiscussion);
router.post("/", discsCtrl.postDiscussion);
router.post("/:discId", discsCtrl.postMessage);


module.exports = router;
