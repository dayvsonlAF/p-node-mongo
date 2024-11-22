import { funcionarioService } from "../services/funcionarioService";
import { Request, Response } from 'express';


class FuncionarioController {

  async get_all_funcionarios(req: Request, res: Response){
    try {
      const funcionarios = await funcionarioService.getAllFuncionarios();
      return res.status(200).json(funcionarios);
    } catch (err) {
      return res.status(500).json({ message: "Erro ao recuperar dados", error: err });
    }
  }

  async get_filtered_funcionarios(req: Request, res: Response) {
    try{
      const { filter, page } = req.params;
      const funcionarios = await funcionarioService.getFilteredFuncionarios(filter, page);
      return res.status(200).json(funcionarios);
    } catch (err) {
      return res.status(500).json({ message: "Nenhum funcionário encontrado", error: err });
    }
  }

  async post_add_funcionarios(req: Request, res: Response) {
    try {
      const funcionario = await funcionarioService.addFuncionario(req.body);
      return res.status(200).json({ message: "Funcionário criado com sucesso", funcionario })
    } catch (err) {
      res.status(500).json({
        message: "Erro ao criar funcionário",
        error: err
      });
    }

  }
}

const funcionariosController = new FuncionarioController();
export { funcionariosController }