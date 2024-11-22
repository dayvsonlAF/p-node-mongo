import mongoose from 'mongoose';
import { Schema, model, Types } from 'mongoose';

// Interface para os dados do funcionário
export interface IFuncionario {
  full_name: string;
  date_of_birth: Date;
  address: string;
  email: string;
  perfil_id: Types.ObjectId;
}

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

export const Funcionario = model<IFuncionario>('Funcionario', funcionarioSchema);