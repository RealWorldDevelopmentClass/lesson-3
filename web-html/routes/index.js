var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/userlist', function(req, res) {
  var db = req.db;
  var collection = db.get('usercollection');
  collection.find({},{},function(e,docs){
    res.render('userlist', {
      "userlist" : docs
    });
  });
});


router.get('/add', function(req, res) {
  var db = req.db;
  var collection = db.get('usercollection');
  collection.insert({username:"ciao",email:"caisdas@sada.it"});
  res.redirect('/userlist'  );
});


module.exports = router;
