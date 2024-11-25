import { Schema, model } from 'mongoose';
import { IPerfil } from '../interfaces/IPerfil';

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

export const Perfil = model<IPerfil>('Perfil', perfilSchema, 'perfil');