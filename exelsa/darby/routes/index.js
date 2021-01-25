var express = require('express');
var router = express.Router();
var models = require('../models');

/* GET home page. */
router.get('/', function(req, res, next) {
  // console.log("><---------------");
  // let carriers = models.Carrier.findAll().then(function(carriers){
  //   let prizes = models.Prize.findAll({
  //     where: {
  //     status: 'current'
  //   }}).then(function(prize){
  //     if ( prize && prize.length > 0 ) {
  //       res.render('index', {'carriers': carriers, 'prize': prize[0] });  
  //       return;
  //     } else {
  //       res.redirect('/prizes/played');
  //     }
  //   });
  // });
  // let subjects = models.Subject.findAll().then(function(subjects){
  //   res.render('index', {'subjects': subjects});
  // });  
  res.render('index', {});
});
router.get('/404', function(req, res, next) {
  res.render('404', {});
});

module.exports = router;
