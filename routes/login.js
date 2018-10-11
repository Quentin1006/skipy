const express = require('express');
const router = express.Router();
const db = require("../db");

const loginCtrl = require('../controllers/loginCtrl');


// LOGIN ROUTES
router.post('/', loginCtrl.authenticateRequest);
router.get('/',  loginCtrl.chefIfUserSession);
router.get('/logout', loginCtrl.logout);


module.exports = router;
