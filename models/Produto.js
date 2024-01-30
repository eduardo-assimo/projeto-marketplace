const mongoose = require('mongoose');

const produtoSchema = new mongoose.Schema ({
    chaveProduto: Number,
    nome: String,
    descricao: String, 
    categoria: String,
    preco: Number,
    imagem: String,
    usuario: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Usuario',
        required: true
     },
});

const Produto = mongoose.model('Produto', produtoSchema);

module.exports = Produto;
