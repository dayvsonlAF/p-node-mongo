import FuncionarioService from "../services/funcionarioService";
import { Request, Response } from 'express';
import { redis } from "../server";

class FuncionarioController {

  public async getAllFuncionario(req: Request, res: Response): Promise<Response>{
    try {
      // Buscando no cache
      const getAllFuncionariosFromCache = await redis.get("getAllFuncionarios")
      if(getAllFuncionariosFromCache){
        const funcionarios = JSON.parse(getAllFuncionariosFromCache);
        return res.status(200).json(funcionarios);
      } else {
        // Buscando no banco e adicionando ao cache
        const funcionarios = await FuncionarioService.getAllFuncionarios();
        await redis.set('getAllFuncionarios', JSON.stringify(funcionarios));
        return res.status(200).json(funcionarios);
      }
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
      await redis.del("getAllFuncionarios");
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
