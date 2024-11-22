import { app } from "./app";
import mongoose from 'mongoose';

const dbURL = "mongodb://localhost:27017/funcionarios"

// Iniciando o servidor imediatamente
app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});

// Conexão com o banco de dados (não bloqueia o servidor)
mongoose.connect(dbURL)
  .then(() => {
    console.log('Conectado ao Banco com Sucesso');
  })
  .catch(err => {
    console.log('Erro ao conectar com o Banco', err);
  });