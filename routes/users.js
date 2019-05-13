const express = require('express');
const router = express.Router();


const usersCtrl = require("../controllers/usersCtrl");

/* GET users listing. */

router.get('/:id', usersCtrl.sendUser);
router.post("/:id/update", usersCtrl.updateUser);
router.get("/:id/friends", usersCtrl.sendUserFriends);
router.get("/checkFriendship/:id/:personId", usersCtrl.checkFriendship)
router.get("/:id/activeDiscussions", usersCtrl.sendUserActiveDiscussions);

router.get("/:id/notifications", usersCtrl.getNotifications);
router.post("/:id/notifications", usersCtrl.addNotification);
router.delete("/:id/notifications/:notifId", usersCtrl.deleteNotification);


module.exports = router;
