const funcionariosRepository = require("../repositories/funcionariosRepository");
const FuncionarioValidation = require("../validation/funcionarioValidation");

class FuncionarioService{

  async getAllFuncionarios() {
    try {
      return await funcionariosRepository.getAllFuncionarios();
    } catch (err) {
      throw new Error('Erro ao recuperar dados de funcionários');
    }
  }

  async getFilteredFuncionarios (filter, page){
    const funcionarios = await funcionariosRepository.findFuncionariosBySearch(filter, page);
    try {
      const totalFuncionarios = await funcionariosRepository.calculatTotalOfFuncionariosBySearch(filter);

  
      return {
        totalFuncionarios,
        page: funcionarios.currentPage,
        limit: funcionarios.limit,
        totalPages: Math.ceil(totalFuncionarios / funcionarios.limit),
        data: funcionarios.data
      };

    } catch (err) {
      console.error(err.message); // Certifique-se de capturar e registrar o erro aqui
      throw new Error('Erro ao buscar funcionários filtrados');
    }
  }

  async addFuncionario(data){

    // Valida os dados de entrada usando o validador
    const validationErrors = FuncionarioValidation.validate(data);

    // Se houver erros de validação, retorna uma resposta de erro
    if (validationErrors) {
      throw new Error('Erro de validação')
    }

    try {
      const {calculatedAge, birthDateUTC} = await funcionariosRepository.calculatedAge(data.date_of_birth);

      const perfilId = await funcionariosRepository.findPerfilByAge(calculatedAge);

      // Se o perfil não for encontrado, retorna erro
      if (!perfilId) {
        return { message: `Perfil para ${calculatedAge >= 18 ? 'maiores' : 'menores'} de 18 não encontrado` }
      }

      // console.log(req.body)
      // Sempre limitar, para evitar inserção indevidas de dados.
      const funcionario = {
        full_name: data.full_name,
        date_of_birth: birthDateUTC,
        address: data.address,
        email: data.email,
        perfil_id: perfilId,
      }

      console.log(funcionario)

      return await funcionariosRepository.createFuncionario(funcionario);

    } catch (err) {
      throw new Error('Erro ao criar funcionário');
    }
  }

}

module.exports = new FuncionarioService();