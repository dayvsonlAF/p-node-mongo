import { Types } from "mongoose";

export interface IGetPerfil{
  _id: string,
  description: string,
}

interface IGetFuncionario{
  _id: string,
  full_name: string,
  date_of_birth: Date,
  address: string,
  email: string,
  perfil_id: Types.ObjectId | IGetPerfil,
  __v: number;
}

// Criando um array de objetos do tipo IGetFuncionario
export type IGetAllFuncionarios = IGetFuncionario[];