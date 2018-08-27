var express = require('express');
var router = express.Router();
var fs = require('fs');


/* GET users listing. */
router.get('/', function(req, res, next) {
  var data = JSON.parse(fs.readFileSync("../data/data.json"));
  res.send(data);
});

module.exports = router;
