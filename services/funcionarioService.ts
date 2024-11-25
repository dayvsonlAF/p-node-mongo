import FuncionariosRepository from "../repositories/funcionariosRepository";
import FuncionarioValidation from "../validation/funcionarioValidation";
import { IFuncionario } from "../interfaces/IFuncionario";
import { Types } from 'mongoose';
import { IGetAllFuncionarios } from "../interfaces/IGetAllFuncionarios";
import { IGetFilteredFuncionarios } from "../interfaces/IGetFilteredFuncionarios";

class FuncionarioService{

  // Trás os todos os funcionários
  async getAllFuncionarios():Promise<IGetAllFuncionarios> {
    try {
      return await FuncionariosRepository.getAllFuncionarios();
    } catch {
      throw new Error('Erro ao recuperar dados de funcionários');
    }
  }

  // Trás os funcionários com base no filtro
  async getFilteredFuncionarios (filter: string, page: string): Promise<IGetFilteredFuncionarios>{
    const funcionarios = await FuncionariosRepository.findFuncionariosBySearch(filter, page);
    try {
      const totalFuncionarios = await FuncionariosRepository.calculatTotalOfFuncionariosBySearch(filter);
  
      return {
        totalFuncionarios: totalFuncionarios.total,
        page: funcionarios.currentPage,
        limit: funcionarios.limit,
        totalPages: Math.ceil(totalFuncionarios.total / funcionarios.limit),
        data: funcionarios.data
      };

    } catch {
      throw new Error('Erro ao buscar funcionários filtrados');
    }
  }

  // Cria um funcionário
  async addFuncionario(data: IFuncionario): Promise<void>{

    // Valida os dados de entrada usando o validador
    const validationErrors = FuncionarioValidation.validate(data);

    // Se houver erros de validação, retorna uma resposta de erro
    if (validationErrors.error) {
      throw new Error('Erro de validação')
    }

    try {
      const {calculatedAge, birthDateUTC} = FuncionariosRepository.calculatedAge(data.date_of_birth);

      const perfilId = await FuncionariosRepository.findPerfilByAge(calculatedAge);

      // Se o perfil não for encontrado, retorna erro
      if (!perfilId) {
        throw new Error(`Perfil para ${calculatedAge >= 18 ? 'maiores' : 'menores'} de 18 não encontrado`)
      }

      if (!perfilId || !perfilId._id) {
        throw new Error('Perfil inválido ou não encontrado.');
      }      

      // console.log(req.body)
      // Sempre limitar, para evitar inserção indevidas de dados.
      const funcionario:IFuncionario = {
        full_name: data.full_name,
        date_of_birth: birthDateUTC,
        address: data.address,
        email: data.email,
        perfil_id: new Types.ObjectId(perfilId._id),
      }

      await FuncionariosRepository.createFuncionario(funcionario);

    } catch (err) {
      throw new Error('Erro ao criar funcionário');
    }
  }

}

export default new FuncionarioService();