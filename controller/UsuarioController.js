const Usuario = require('../models/Usuario');
const { conectarAoMongoDB, fecharConexao, mongoose } = require('../db/db');


class UsuarioController {

    static get(req, res, next) {
        res.send('Get na rota listar')
    };

  async buscarUsuario(email) {

    try {
      await conectarAoMongoDB();
      const usuarioEncontrado = await Usuario.findOne({ email: email });
      return usuarioEncontrado
    } catch (error) {
      console.error(error);
      throw new Error('Erro interno do servidor no momento da busca de usuário.');
    } finally {
      await fecharConexao();
    }
  }

  async cadastrarUsuario(nome, email, senha) {
    try {

      await conectarAoMongoDB();

      const usuarioMax = await Usuario.findOne()
      .sort({ idUsuario: -1 }) // Ordenar em ordem decrescente
      .exec();

      const novoIdUsuario = usuarioMax ? usuarioMax.idUsuario + 1 : 1

      const valorid = new mongoose.Types.ObjectId(); // Cria um novo ObjectId

      // Inserir novo usuário no banco de dados
      const novoUsuario = new Usuario({
        idUsuario: novoIdUsuario, 
        nome: nome, 
        email: email, 
        senha: senha
      });

      novoUsuario._id = valorid;

      await novoUsuario.save();

      return { id: novoUsuario.idUsuario };
    } catch (error) {
      console.error(error);
      throw new Error('Erro interno do servidor no momento da inclusão de novo usuário.');
    } finally {
      await fecharConexao();
    }
  }

    static put(req, res, next) {
        res.send('retorno do put')
    };

    static delete(req, res, next) {
        res.send('retorno do delete')
    };

}

module.exports = UsuarioController;