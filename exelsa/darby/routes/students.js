var express = require('express');
var router = express.Router();
var models = require('../models');

var int_try_parse = function(val, default_val, radix)
{
    try
    {
        radix = radix || 10;
        default_val = default_val || 0;

        //validate this object is not null
        if (val != null)
        {
                    //convert to string
            // var thatx = JSON.stringify(val);
            var thatx = val;
            // console.log("><.>", that);
            if (thatx.length > 0)
            {
              // console.log("NOl", isNaN(that));
                //check to see the string is not NaN, if not parse
                if (!isNaN(thatx))   
                    return parseInt(thatx, radix);
            }
        }
    }
    catch (err)
    {
        console.log(err);   
    }
    //this is not a number
    return default_val;
}
router.get('/signup', function(req, res, next) {
  // console.log("><>", req.query);
  
  var _subjectId = req.query.subject_id || "0";
  var subjectId = int_try_parse(_subjectId, 0, 10);
  // console.log("||", subjectId);
  if (subjectId <= 0) {
    res.redirect('/');
    return;
  }
  
  models.Subject.findOne({ where: {id: subjectId} }).then(subjectO => {
    if (subjectO === null  ) {
      res.redirect('/');
    } else {
      res.render('students/signup', {'current_subject': subjectO});
    }
    
  }, function(err){
    res.redirect('/');
    return;
  });  
});

router.get('/success', function(req, res, next) {
  res.render('students/success', {});  
});


router.get('/error', function(req, res, next) {
  res.render('students/error', {});  
});

router.post('/sign_up', function(req, res, next) {
  // console.log("><>>", req.body);
  let firstName = req.body.firstName || "-";
  let lastName = req.body.lastName || "-";
  let phone = req.body.phone || "-";
  let level = req.body.level || "-";
  let email = req.body.email || "-";
  let schoolId = 1;
  let subjectId = parseInt(req.body.subjectId);
  
  const studentObject = models.Student.build({
    firstName: firstName.toUpperCase(),
    lastName: lastName.toUpperCase(),
    phone: phone,
    level: level,
    email: email,
    SchoolId: schoolId,
    SubjectId: subjectId
  })
  
  studentObject
  .save()
  .then(anotherTask => {
    res.redirect('/students/success');
  })
  .catch(error => {
    res.redirect('/students/error');
  });
});

module.exports = router;
