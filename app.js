const express = require('express');
const mongoose = require('mongoose');
const funcionariosRoutes = require('./routes/funcionariosRoutes');

const app = express();
app.use(express.json());

const dbURL = "mongodb://localhost:27017/funcionarios"

mongoose.connect(dbURL)
  .then(result => {
    app.listen(3000)
    console.log('Conectado ao Banco com Sucesso')
  })
  .catch(err => {
    console.log('Erro ao conectar com o Banco', err)
  })

app.use('/funcionarios', funcionariosRoutes);