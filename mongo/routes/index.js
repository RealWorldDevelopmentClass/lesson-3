var express = require('express');
var router = express.Router();

var monk = require("monk");

var db = monk("localhost:27017/nodeDBTest")

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {title: 'Express'});
});

router.get('/insert', function (req, res, next) {
  var listaNomiTBL = db.get("listaNomi");
  var recordDaInserire = {
    nome: req.param("nome"),
    cognome: req.param("cognome")
  };

  //la var risultato non restituisce valore perché la funzione è asincrona
  var risultato = listaNomiTBL.insert(recordDaInserire, function (err, doc) {
    if (err) res.jsonp(err);
    res.jsonp(doc);

  });
});
router.get('/insertVoti', function (req, res, next) {
  var votiAlunniTBL = db.get("votiAlunni");

  var nomi = ["Francesco", "Kevin", "Federico", "Ugo", "Matilde"];

  for (var i = 0; i < 30; i++)
    votiAlunniTBL.insert({
      nome: nomi[i % 5],
      voto: Math.floor((Math.random() * 12) + 18)
    });
  res.end();
});


router.get('/getVoti', function (req, res, next) {
  var votiAlunniTBL = db.get("votiAlunni");

  votiAlunniTBL.find({nome: req.query['nome']}, function (err, docs) {
    var sum = 0;
    docs.forEach(function (v) {
      sum += v.voto;
    });
    sum /= docs.length;
    res.jsonp(sum);
  })
});


router.get('/getVotiList', function (req, res, next) {
  var votiAlunniTBL = db.get("votiAlunni");

  votiAlunniTBL.find({voto: {$gt: 23}, nome: {$in: ["Federico", "Ugo"]}},
    {}//   {sort: {voto: 1, nome: -1}, limit: 5, skip: 4}
    , function (err, docs) {

      res.render('list',{docs:docs});

    })
});


router.get('/esempioUpdate', function (req, res, next) {
  var votiAlunniTBL = db.get("votiAlunni");

  votiAlunniTBL.find({voto: {$gt: 23}, nome: {$in: ["Federico", "Ugo"]}},
    {sort: {voto: 1, nome: -1}}
    , function (err, docs) {
      console.log(docs[0], docs[0]._id);
      votiAlunniTBL.updateById(docs[0]._id, {$inc: {voto: 4000}}, function (err, doc) {
        res.jsonp([err, doc]);
      });
    });
});

module.exports = router;
