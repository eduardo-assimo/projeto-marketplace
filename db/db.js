const mongoose = require('mongoose');
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

// Conectar ao MongoDB
async function conectarAoMongoDB() {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(process.env.DBMONGO_URL, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  }

async function fecharConexao() {
    try {
      await mongoose.connection.close();
      console.log('Conexão com o MongoDB fechada com sucesso.');
    } catch (error) {
      console.error('Erro ao fechar a conexão com o MongoDB:', error.message);
    }
  }
  
  module.exports = {
    conectarAoMongoDB,
    fecharConexao,
    mongoose
  };