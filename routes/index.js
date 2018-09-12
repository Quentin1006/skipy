const express = require('express');
const router = express.Router();

const { attachUserToReq } = require("../modules/authenticate/attachUser");

///// MIDDLEWARE /////

//router.use(/\/\w+/, attachUserToReq);
router.use(attachUserToReq);



// AJOUTER TOUTES LES ROUTES AINSI QUE LEUR ROUTE PATH ICI 
// POUR NE PAS AVOIR A TOUCHER LE FICHIER APP

///// ROUTES /////
router.use('/users', require("./users"));
router.use('/discussions', require("./discussions"));
router.use('/login', require("./login"));



module.exports = router;
