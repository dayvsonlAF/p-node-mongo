const Perfil = require("../models/perfil");

class FuncionariosRepository{
  async findPerfilByAge(calculatedAge){
    try {
      const match = { age: { [calculatedAge >= 18 ? '$gte' : '$lt']: 18 } }

      const perfil = await Perfil.aggregate([
        { $match: match }, // Aplica a condição baseada na idade
        { $project: { _id: 1 } } // Seleciona apenas o campo _id
      ])

       // Se um perfil for encontrado, retorna o id
       return perfil.length > 0 ? perfil[0]._id : null; // Retorna o _id ou null se não encontrar
    } catch (err) {
      throw new Error('Erro ao buscar perfil por idade');
    }
  }
}

module.exports = new FuncionariosRepository();