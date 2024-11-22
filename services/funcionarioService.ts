import { funcionariosRepository } from "../repositories/funcionariosRepository";
import { funcionarioValidation } from "../validation/funcionarioValidation";
import { IFuncionario } from "../models/funcionarios";
import { Types } from 'mongoose';

class FuncionarioService{

  async getAllFuncionarios() {
    try {
      return await funcionariosRepository.getAllFuncionarios();
    } catch {
      throw new Error('Erro ao recuperar dados de funcionários');
    }
  }

  async getFilteredFuncionarios (filter: string, page: string){
    const funcionarios = await funcionariosRepository.findFuncionariosBySearch(filter, page);
    try {
      const totalFuncionarios = await funcionariosRepository.calculatTotalOfFuncionariosBySearch(filter);

  
      return {
        totalFuncionarios,
        page: funcionarios.currentPage,
        limit: funcionarios.limit,
        totalPages: Math.ceil(totalFuncionarios.total / funcionarios.limit),
        data: funcionarios.data
      };

    } catch {
      throw new Error('Erro ao buscar funcionários filtrados');
    }
  }

  async addFuncionario(data: IFuncionario){

    // Valida os dados de entrada usando o validador
    const validationErrors = funcionarioValidation.validate(data);

    // Se houver erros de validação, retorna uma resposta de erro
    if (validationErrors) {
      throw new Error('Erro de validação')
    }

    try {
      const {calculatedAge, birthDateUTC} = funcionariosRepository.calculatedAge(data.date_of_birth);

      const perfilId = await funcionariosRepository.findPerfilByAge(calculatedAge);

      // Se o perfil não for encontrado, retorna erro
      if (!perfilId) {
        return { message: `Perfil para ${calculatedAge >= 18 ? 'maiores' : 'menores'} de 18 não encontrado` }
      }

      if (!perfilId || !perfilId._id) {
        throw new Error('Perfil inválido ou não encontrado.');
      }      

      // console.log(req.body)
      // Sempre limitar, para evitar inserção indevidas de dados.
      const funcionario = {
        full_name: data.full_name,
        date_of_birth: birthDateUTC,
        address: data.address,
        email: data.email,
        perfil_id: new Types.ObjectId(perfilId._id),
      }

      console.log(funcionario)

      return await funcionariosRepository.createFuncionario(funcionario);

    } catch (err) {
      throw new Error('Erro ao criar funcionário');
    }
  }

}

const funcionarioService =  new FuncionarioService();
export { funcionarioService }