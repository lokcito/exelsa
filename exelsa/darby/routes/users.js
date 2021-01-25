var express = require('express');
var models = require('../models');

var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('users/index.ejs', { title: 'Express' });
});

router.get('/filter.json', function(req, res, next){
  models.User.findAll({

  }).then(function(users){
    res.json({
      objects: users,
      status: true,
    });
  });
});

module.exports = router;
