const express = require('express');
const router = express.Router();


// AJOUTER TOUTES LES ROUTES AINSI QUE LEUR ROUTE PATH ICI 
// POUR NE PAS AVOIR A TOUCHER LE FICHIER APP

router.use('/users', require("./users"));
router.use('/discussions', require("./discussions"));
router.use('/login', require("./login"));


module.exports = router;
