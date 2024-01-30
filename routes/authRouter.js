const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const Usuario = require('../models/Usuario');

const router = express.Router();

// Rota de login
router.post('/auth', authMiddleware.autenticacaoLocal)

router.get('/sucesso-login', function(req, res, next) {
    res.render('pagina-principal', { title: 'Página Principal' });
  });

module.exports = router;
