var express = require("express");
var router = express.Router();
var models = require("../models");
const Sequelize = require("sequelize");
var token = "eyJhbGciOiJIUz111I1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab301RMHrHDcEfxjoYZg553eFONFh7HgQ";
router.get("/current", function(req, res, next) {
  if ( token !== req.query.token) {
    res.redirect("/404"); 
    return;
  }
  let prizes = models.Prize.findAll({
    where: {
      status: "current"
    }
  }).then(function(prize) {
    if (prize && prize.length > 0) {
      let currentPrize = prize[0];

      currentPrize
        .getStudents()
        .then(function(rows) {
          models.Student.findAll({
            where: {
              PrizeId: currentPrize.id
            },
            attributes: [["DISTINCT(CarrierId)", "count"]]
          })
            .then(function(ncarriers) {
              res.render("prizes/current", {
                prize: currentPrize,
                n: rows.length,
                ncarriers: ncarriers.length
              });
            })
            .catch(function(err) {
              res.render("prizes/current", {
                prize: currentPrize,
                n: 0,
                ncarriers: 0
              });
            });
        })
        .catch(function(err) {
          res.render("prizes/current", {
            prize: currentPrize,
            n: 0,
            ncarriers: 0
          });
        });

      return;
    } else {
      res.redirect("/404");
    }
  });
});

router.get('/create', function(req, res, next) {
  if ( token !== req.query.token) {
    res.redirect("/404"); 
    return;
  }  
  let prizes = models.Prize.findAll({
    where: {
      status: "current"
    }
  }).then(function(prize) {
    if (prize && prize.length > 0) {
      let currentPrize = prize[0];
      res.render('prizes/create', {'prize': currentPrize});  
    } else {
      res.render('prizes/create', {'prize': undefined});   
    }
  });
});

router.post("/store", function(req, res, next) {  
  let school = req.body.school || "-";
  const prizeObject = models.Prize.build({
    school: school.toUpperCase(),
    status: 'current'
  })
  
  prizeObject
  .save()
  .then(anotherTask => {
    res.redirect('/prizes/current?token=' + token);
  })
  .catch(error => {
    res.redirect('/404');
  });  
});

function randomNumber(min, max) {
  if (min > max) {
    let temp = max;
    max = min;
    min = max;
  }

  if (min <= 0) {
    return Math.floor(Math.random() * (max + Math.abs(min) + 1)) + min;
  } else {
    return Math.floor(Math.random() * max) + min;
  }
}

router.post("/set_winner", function(req, res, next) {
  let prizeId = req.body.prizeId;
  models.Prize.findAll({
    where: {
      id: prizeId,
      status: 'current'
    }
  })
    .then(function(prizes) {
      if (prizes && prizes.length > 0) {
        let currentPrizes = prizes[0];
        models.Student.findAll({
          where: {
            PrizeId: currentPrizes.id
          }
        })
          .then(function(students) {
            if (students && students.length > 0) {
              /* 
               * Aqui se hace el sorteo
               *
              */
              var positonRow = randomNumber(0, students.length - 1);
              let currentStudent = students[positonRow];

              models.Student.update({
                winner: true,
              }, {
                where: {
                  id: currentStudent.id
                }
              });
              
              models.Prize.update({
                status: 'played'
              }, {
                where: {
                  id: currentPrizes.id
                }
              });
              /* 
               * End
               *
              */              
              res.json({
                status: true,
                object: {
                  winner: currentStudent.getFullname,
                  phone: currentStudent.phone,
                }
              });
            } else {
              res.json({
                status: false
              });
            }
          })
          .catch(function() {
            res.json({
              status: false
            });
          });
      } else {
        res.json({
          status: false
        });
      }
    })
    .catch(function(err) {
      res.json({
        status: false
      });
    });
});


router.get('/played', function(req, res, next) {
    let prizes = models.Prize.findAll({
      order: [
        ['id', 'DESC']
      ],
      where: {
      status: 'played'
    }}).then(function(prize){
      if ( prize && prize.length > 0 ) {
        let currentPrize = prize[0];
        let student = models.Student.findAll({
          where: {
            winner: 1,
            PrizeId: currentPrize.id
          }
        }).then(function(students){
          if ( students && students.length > 0 ) {
            res.render('prizes/played', { 'prize': currentPrize, 
                                 'student': students[0]});  
          } else {
            res.render('prizes/played', { 'prize': currentPrize, 
                                 'student': undefined});  
          }
        });
      } else {
        res.redirect('/404');
      }
    });
});



module.exports = router;
