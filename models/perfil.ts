import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const perfilSchema = new Schema({
  description: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  }
})

const Perfil = mongoose.model('Perfil', perfilSchema, 'perfil');
export { Perfil }