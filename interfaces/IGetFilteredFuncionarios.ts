import { IGetAllFuncionarios } from "./IGetAllFuncionarios";

export interface IGetFilteredFuncionarios {
  totalFuncionarios: number,
  page: number,
  limit: number,
  totalPages: number,
  data: IGetAllFuncionarios
}