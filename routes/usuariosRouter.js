const express = require('express');
const UsuarioController = require('../controller/UsuarioController');
const router = express.Router();

const app = express();

const usuarioController = new UsuarioController();

router.post('/usuarios',  async (req, res) => {
    try {
      const { nome, email, senha } = req.body;
      const resultado = await usuarioController.cadastrarUsuario(nome, email, senha);
      res.status(201).json(resultado);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

router.put('/:id', UsuarioController.put);
router.delete('/:id', UsuarioController.delete);

module.exports = router;
