import { Types } from 'mongoose';

// Interface para os dados do funcionário
export interface IFuncionario {
  full_name: string;
  date_of_birth: Date;
  address: string;
  email: string;
  perfil_id: Types.ObjectId;
}