const FuncionarioService = require("../services/funcionarioService")
// const mongoosePaginate = require('mongoose-paginate-v2');

class FuncionarioController {

  async get_all_funcionarios(req, res){
    try {
      const funcionarios = await FuncionarioService.getAllFuncionarios();
      return res.status(200).json(funcionarios);
    } catch (err) {
      return res.status(500).json({ message: "Erro ao recuperar dados", error: err });
    }
  }

  async get_filtered_funcionarios(req, res) {
    try{
      const { filter, page } = req.params;
      const funcionarios = await FuncionarioService.getFilteredFuncionarios(filter, page);
      return res.status(200).json(funcionarios);
    } catch (err) {
      return res.status(500).json({ message: "Nenhum funcionário encontrado", error: err });
    }
  }

  async post_add_funcionarios(req, res) {
    try {
      const funcionario = await FuncionarioService.addFuncionario(req.body);
      return res.status(200).json({ message: "Funcionário criado com sucesso", funcionario })
    } catch (err) {
      res.status(500).json({
        message: "Erro ao criar funcionário",
        error: err
      });
    }

  }
}
module.exports = new FuncionarioController();