import { Funcionario, IFuncionario } from "../models/funcionarios";
import { Perfil } from "../models/perfil";
import moment from 'moment-timezone';

class FuncionariosRepository{
  calculatedAge(birth: Date): {calculatedAge: number, birthDateUTC:Date}{
    try {
      // Detecta o fuso horário local automaticamente
      // const localTimezone = moment.tz.guess();
      // console.log('localtimezone', localTimezone)

      // Converte a data de nascimento para UTC, ajustando o fuso horário local
      const birthDateLocal = moment.tz(birth, "Etc/GMT+3");
      console.log("Data em Brasília (local):", birthDateLocal.format()); // Exibe a data em Brasília

      // Converte a data para UTC, pois o MongoDB armazena como UTC
      const birthDateUTC = birthDateLocal.utc().toDate(); // Converte para UTC e transforma em objeto Date
      console.log("Data em UTC:", birthDateUTC.toISOString()); // Exibe a data em UTC (no formato ISO 8601)

      // Data atual em Brasilia
      const currentDateBrasilia = moment.tz('America/Sao_Paulo'); // Hora atual em Brasília

      // Calculando a idade
      const age = currentDateBrasilia.diff(birthDateLocal, 'years'); // Diferença em anos

      // Verificar se o aniversário já passou este ano
      const isBirthdayPassed = currentDateBrasilia.isSameOrAfter(birthDateLocal, 'day');

      // Verificar se o aniversário já passou este ano
      const calculatedAge = isBirthdayPassed ? age : age - 1;

      return {calculatedAge, birthDateUTC};
    } catch {
      throw new Error ('Erro ao calcular a Idade')
    }
  }

  async getAllFuncionarios(){
    try {
      const funcionarios = Funcionario.find()
        .populate('perfil_id', 'description')
          return funcionarios;
    } catch {
      throw new Error('Erro ao buscar funcionarios');
    }
  }

  async findPerfilByAge(calculatedAge: number): Promise<{_id: string | null}>{
    try {
      const match = { age: { [calculatedAge >= 18 ? '$gte' : '$lt']: 18 } }

      const perfil = await Perfil.aggregate([
        { $match: match }, // Aplica a condição baseada na idade
        { $project: { _id: 1 } } // Seleciona apenas o campo _id
      ])

       // Se um perfil for encontrado, retorna o id
       return perfil.length > 0 ? perfil[0]._id : null; // Retorna o _id ou null se não encontrar
    } catch {
      throw new Error('Erro ao buscar perfil por idade');
    }
  }

  async findFuncionariosBySearch(filter: string, page: string): Promise<{data: object, currentPage: number, limit: number}> {
    try {
      
      const currentPage = parseInt(page);
      const limit = 2;

      const skip = (currentPage - 1) * limit

      if (isNaN(currentPage) || currentPage < 1) {
        throw new Error("Número de página inválido.");
      }

      const data = await Funcionario.aggregate([
        {
          $match: {
            $or: [
              {
                full_name: { $regex: filter, $options: 'i' }  // Buscando 'filter' em qualquer parte do full_name
              },
              {
                address: { $regex: filter, $options: 'i' }  // Buscando 'filter' em qualquer parte do address
              }
            ]
          }
        },
        {
          $skip: skip
        },
        {
          $limit: limit
        }
      ])

      if (!data || data.length === 0) {
        throw new Error("Nenhum funcionário encontrado.");
      }

      return {data, currentPage, limit};

    } catch (err: any) {
      throw new Error("Erro ao buscar funcionários: " + err.message);
    }
  }

  async calculatTotalOfFuncionariosBySearch (filter: string): Promise<{total: number}> {
    try {
      const total = await Funcionario.countDocuments({
        $or: [
          { full_name: { $regex: filter, $options: 'i' } },
          { address: { $regex: filter, $options: 'i' } }
        ]
      });

      return { total };
    } catch {
      throw new Error("Não foi possível calcular a quantidade de funcionários com essa busca");
    }
  }

  async createFuncionario(funcionarioData: IFuncionario) {
  try {
    const newFuncionario = new Funcionario(funcionarioData);
    return await newFuncionario.save();
  } catch (error) {
    throw new Error('Erro ao salvar funcionário');
  }
}

}

const funcionariosRepository = new FuncionariosRepository();
export { funcionariosRepository }