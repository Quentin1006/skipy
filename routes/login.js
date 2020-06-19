const express = require('express');
const router = express.Router();

const loginCtrl = require('../controllers/loginCtrl');


// LOGIN ROUTES
router.post('/', loginCtrl.authenticateRequest);
router.get('/',  loginCtrl.checkIfUserSession);
router.get('/logout', loginCtrl.logout);


module.exports = router;
