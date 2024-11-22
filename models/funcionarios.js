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
    required: true,
    // index: true
  },
  email: {
    type: String,
    required: true
  },
  perfil_id: {
    type: Schema.Types.ObjectId, // Relacionamento com a coleção perfil
    ref: 'Perfil', // Nome do modelo relacionado
    required: true
  }
})

// Adiconando esse index, para poder usar o search depois.
funcionarioSchema.index({ full_name: 'text', address: 'text' });

const Funcionario = mongoose.model('Funcionario', funcionarioSchema);
module.exports = Funcionario;