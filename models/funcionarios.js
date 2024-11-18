const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const funcionarioSchema = new Schema({
  full_name: {
    type: String,
    required: true
  },
  date_of_birth: {
    type: Date,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  roles: {
    type: Array
  }
})

const Funcionario = mongoose.model('Funcionario', funcionarioSchema);
module.exports = Funcionario;