const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema ({
    _id: mongoose.Schema.Types.ObjectId, // Defina o campo _id como uma string
    idUsuario: Number,
    nome: String,
    email: String, 
    senha: String
});

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;