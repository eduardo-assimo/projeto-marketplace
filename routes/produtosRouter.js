const express = require('express');
const multer = require('multer');
const path = require('path');
const ProdutoController = require('../controller/ProdutoController');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');

const produtoController = new ProdutoController();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log('file')
    console.log(file)
    cb(null, './public/images/'); // O diretório onde as imagens serão armazenadas
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if((file.mimetype).includes('jpeg') || (file.mimetype).includes('png') || (file.mimetype).includes('jpg')){
      cb(null, true);
  } else{
      cb(null, false);

  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter, });

router.get('/produtos/cadastrar', function(req, res) {
    res.render('cadastra-produtos', { title: 'Cadastrar Produtos' });
  });

router.get('/produtos/alterar/:productId', async (req, res) => {
  const produtoId = req.params.productId;
  const produto = await produtoController.buscaProduto(produtoId);
  res.render('altera-produtos', { produto });
});

router.get('/produtos/listar', async (req, res) => {
    try {
      const produtos = await produtoController.listaProdutos();
      res.render('lista-produtos', { produtos });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao obter produtos.' });
    }
  });

router.get('/produtos/visualizar-por-usuario', authMiddleware.protegerRotaJWT, async (req, res) => {
    try {
      const produtos = await produtoController.listaProdutosUsuario(req.usuarioID);
      res.render('visualiza-produtos-usuario', { produtos });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao obter produtos.' });
    }
  });

router.post('/produtos/cadastra-produtos', authMiddleware.protegerRotaJWT, upload.single('imagem'), async (req, res) => {
    try {
      const { nome, descricao, preco, categoria } = req.body;
      let imagemPath = req.file ? req.file.path : '';
      if(imagemPath != ''){
        imagemPath = imagemPath.replace(/\\/g, '/').replace(/^public[\\/]/i, '');
        imagemPath = '/' + imagemPath
      }
      const resultado = await produtoController.cadastrarProduto(nome, descricao, preco, categoria, req.usuarioID, imagemPath);
      res.status(201).json(resultado);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

router.post('/produtos/alterar/:productId', authMiddleware.protegerRotaJWT, upload.single('imagem'), async (req, res) => {
    try {
      const produtoId = req.params.productId;
      const { nome, descricao, preco, categoria } = req.body;
      let imagemPath = req.file ? req.file.path : '';
      if(imagemPath != ''){
        imagemPath = imagemPath.replace(/\\/g, '/').replace(/^public[\\/]/i, '');
        imagemPath = '/' + imagemPath
      }
      const resultado = await produtoController.alterarProduto(nome, descricao, preco, categoria, produtoId, imagemPath);
      res.status(201).json(resultado);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  router.delete('/produtos/excluir/:produtoId', async (req, res) => {
    const produtoId = req.params.produtoId;
    try {
      const resultado = await produtoController.excluirProduto(produtoId);
      res.json(resultado);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao excluir o produto.' });
    }
  });

module.exports = router;
