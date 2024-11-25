import { IGetAllFuncionarios } from "../interfaces/IGetAllFuncionarios";
import FuncionarioService from "../services/funcionarioService";
import { NextFunction, Request, Response } from 'express';


class FuncionarioController {

  // Trás todos os funcionários
  public async getAllFuncionario(req: Request, res: Response, next: NextFunction): Promise<Response>{
    try {
      const funcionarios = await FuncionarioService.getAllFuncionarios();
      return res.status(200).json(funcionarios);
    } catch (err) {
      return res.status(500).json({ message: "Erro ao recuperar dados", error: err });
    }
  }

  async get_filtered_funcionarios(req: Request, res: Response): Promise<Response> {
    try{
      const { filter, page } = req.params;
      const funcionarios = await FuncionarioService.getFilteredFuncionarios(filter, page);
      return res.status(200).json(funcionarios);
    } catch (err) {
      return res.status(500).json({ message: "Nenhum funcionário encontrado", error: err });
    }
  }

  async post_add_funcionarios(req: Request, res: Response): Promise<Response> {
    try {
      const funcionario = await FuncionarioService.addFuncionario(req.body);
      return res.status(200).json({ message: "Funcionário criado com sucesso", funcionario })
    } catch (err) {
      return res.status(500).json({
        message: "Erro ao criar funcionário",
        error: err
      });
    }

  }
}

export default new FuncionarioController();
