var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/cadastro', function(req, res, next) {
  res.render('cadastra-usuario', { title: 'Cadastro Usuario' });
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login Usuario' });
});

module.exports = router;