const jwt = require('jsonwebtoken');
const UsuarioController = require('../controller/UsuarioController');
const usuarioController = new UsuarioController();

// Configuração para autenticação local
const autenticacaoLocal = async (req, res) => {
  const { email, senha } = req.body;
  try {
    const usuario = await usuarioController.buscarUsuario(email);

    if (!usuario) {
      return res.status(401).json({ mensagemErro: 'Usuário não encontrado.' });
    }

    const senhaValida = senha === usuario.senha;

    if (!senhaValida) {
      return res.status(401).json({ mensagemErro: 'Senha incorreta.' });
    }

    // Se a autenticação for bem-sucedida, adicionamos o usuário ao objeto de requisição
    const token = jwt.sign({ email: usuario.email, userId: usuario._id }, process.env.JWT_SECRET, { expiresIn: '10m' });
    res.cookie('token', token, { httpOnly: true });
    res.json({ token, redirectTo: '/sucesso-login' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensagemErro: 'Erro na autenticação.' });
  }
};

// Middleware para proteger rotas com JWT
const protegerRotaJWT = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ mensagem: 'Token não encontrado.' });
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.usuarioID = decode.userId
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ mensagem: 'Token inválido.' });
  }
};

module.exports = {
  autenticacaoLocal,
  protegerRotaJWT,
};
