const Produto = require('../models/Produto');
const { conectarAoMongoDB, fecharConexao } = require('../db/db');
const path = require('path');

class ProdutoController {

  async excluirProduto (produtoId) {
    try {
      await conectarAoMongoDB();
      const resultado = await Produto.deleteOne({ chaveProduto: produtoId });
  
      if (resultado.deletedCount === 1) {
        return { mensagem: 'Produto excluído com sucesso.' };
      } else {
        return { mensagem: 'Produto não encontrado.' };
      }
    } catch (error) {
      console.error(error);
      throw new Error('Erro ao excluir o produto.');
    } finally {
      await fecharConexao();
    }
  };

  async buscaProduto(produtoId) {
    try {
      await conectarAoMongoDB();
      const produto = await Produto.findOne({ chaveProduto: produtoId }).exec();
      return produto;
    } catch (error) {
      console.error(error);
      throw new Error('Erro interno do servidor no momento da busca de produto.');
    } finally {
      await fecharConexao();
    }
  };

  async listaProdutosUsuario(idUser) {
    try {
      await conectarAoMongoDB();
      const produtos = await Produto.find({ usuario: idUser }).exec();
      return produtos;
    } catch (error) {
      console.error(error);
      throw new Error('Erro interno do servidor no momento da listagem de produtos.');
    } finally {
      await fecharConexao();
    }
  }

  async listaProdutos() {
    try {
      await conectarAoMongoDB();
      const produtos = await Produto.find()
        .populate({path: 'usuario'})
        .sort({ nome: 1 }) 
        .exec();
      return produtos;
    } catch (error) {
      console.error(error);
      throw new Error('Erro interno do servidor no momento da listagem de produtos.');
    } finally {
      await fecharConexao();
    }
  }

  async cadastrarProduto(nome, descricao, preco, categoria, idUsuario, imagemPath) {
    try {

      await conectarAoMongoDB();

      const produto = await Produto.findOne()
      .sort({ chaveProduto: -1 }) // Ordenar em ordem decrescente
      .exec();

      const novaChaveProduto = produto ? produto.chaveProduto + 1 : 1

      // Inserir novo produto no banco de dados
      const novoProduto = new Produto({
        chaveProduto: novaChaveProduto,
        nome: nome, 
        descricao: descricao, 
        preco: preco,
        categoria: categoria,
        usuario: idUsuario,
        imagem: imagemPath
      });

      console.log(novoProduto)

      await novoProduto.save();

      return { id: novoProduto.chaveProduto };
    } catch (error) {
      console.error(error);
      throw new Error('Erro interno do servidor no momento da inclusão de novo produto.');
    } finally {
      await fecharConexao();
    }
  }


async alterarProduto(nome, descricao, preco, categoria, produtoId, imagemPath) {
  try {

    let resultado;

    await conectarAoMongoDB();
    
    if(imagemPath != ''){
      resultado = await Produto.updateOne(
        { chaveProduto: produtoId },
        {
            $set: {
                nome: nome,
                descricao: descricao,
                preco: preco,
                categoria: categoria,
                imagem: imagemPath,
            }
        }
      );
    } else {
      resultado = await Produto.updateOne(
        { chaveProduto: produtoId },
        {
            $set: {
                nome: nome,
                descricao: descricao,
                preco: preco,
                categoria: categoria,
            }
        }
      );
    }

    if (resultado.nModified === 0) {
      throw new Error('Produto não encontrado ou não foi modificado');
    }

    return { mensagem: 'Produto alterado com sucesso' };
  } catch (error) {
    console.error(error);
    throw new Error('Erro interno do servidor no momento da inclusão de novo produto.');
  } finally {
    await fecharConexao();
  }
}
}

module.exports = ProdutoController;