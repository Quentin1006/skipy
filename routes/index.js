const express = require('express');
const router = express.Router();

const { attachUserToReq, verifyUser } = require("../modules/register/helper");

///// MIDDLEWARE /////

//router.use(/\/\w+/, attachUserToReq);
router.use(attachUserToReq);
router.use(/^(?!\/login)/, verifyUser)



// AJOUTER TOUTES LES ROUTES AINSI QUE LEUR ROUTE PATH ICI 
// POUR NE PAS AVOIR A TOUCHER LE FICHIER APP

///// ROUTES /////

router.use('/users', require("./users"));
router.use('/discussions', require("./discussions"));

// /login et ses sous routes sont les seules routes 
// accessibles a l'utilisateur sans creds 
router.use('/login', require("./login"));



module.exports = router;
