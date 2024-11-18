const moment = require('moment-timezone');
const Funcionario = require('../models/funcionarios');
const Perfil = require('../models/perfil');

const get_all_funcionarios = (req, res) => {
  Funcionario.find()
    .populate('perfil_id', 'description')
    .then((funcionarios) => {
      return res.status(200).json(funcionarios);
    })
    .catch(err => {
      return res.status(500).json({ message: "Erro ao recuperar dados", error: err });
    })
}

// const post_add_funcionarios = async (req, res) => {

//   try{
//     const birthDateUTC = new Date(req.body.date_of_birth);
//     const birthDate = new Date(birthDateUTC.getTime() - 3 * 60 * 60 * 1000);
    
//     // Data atual em UTC-3
//     const now = new Date();
//     const currentDateBrasilia = new Date(now.getTime() - 3 * 60 * 60 * 1000)
//     const age = currentDateBrasilia.getUTCFullYear() - birthDate.getUTCFullYear();
//     const isBirthdayPassed = currentDateBrasilia.getUTCMonth() >  birthDate.getUTCMonth() || currentDateBrasilia.getUTCMonth() === birthDate.getUTCMonth() && currentDateBrasilia.getUTCDate() >= birthDate.getUTCDate();

//     const calculatedAge = isBirthdayPassed ? age : age - 1;

//     // Buscar os documents na collection 'perfil'
//     const perfis = await Perfil.find();


//     if(!perfis == perfis.length === 0){
//       return res.status(404).json({ message: "Nenhum perfil encontrado" });
//     }

//     // Selecionar perfil adequado pela idade
//     let perfilId;
//     perfis.forEach(perfil => {
//       if (calculatedAge >= 18 && perfil.age === 18){
//         perfilId = perfil._id; // ID do perfil para maiores de 18 anos
//       } else if (calculatedAge <= 17 && perfil.age === 17) {
//         perfilId = perfil._id; // ID do perfil para menores de 18 anos
//       }
//     })

//     if (!perfilId) {
//       return res.status(400).json({ message: "Nenhum perfil compatível com a idade do funcionário foi encontrado" });
//     }

//     // console.log(req.body)
//     // Sempre limitar, para evitar inserção indevidas de dados.
//     const add_funcionario = new Funcionario({
//       full_name: req.body.full_name,
//       date_of_birth: req.body.date_of_birth,
//       address: req.body.address,
//       email: req.body.email,
//       perfil_id: perfilId
//     })
//     // const add_funcionario = new Funcionario(req.body)

//     await add_funcionario.save()
//     .then(funcionario => {
//       res.status(200).json({ message: "Funcionário criado com sucesso", funcionario })
//     })
//     .catch(err => {
//       res.status(500).json({ message: "Erro ao criar funcionário", error: err })
//     })

//   } catch (err) {
//     res.status(500).json({ 
//       message: "Erro ao criar funcionário", 
//       error: err 
//     });
//     console.log(err)
//   }
  
// }

const post_add_funcionarios = async (req, res) => {

  try{
    // Detecta o fuso horário local automaticamente
    // const localTimezone = moment.tz.guess();
    // console.log('localtimezone', localTimezone)

    // Converte a data de nascimento para UTC, ajustando o fuso horário local
    const birthDateLocal = moment.tz(req.body.date_of_birth, "Etc/GMT+3");
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
    console.log("Idade calculada:", calculatedAge);

    let perfilId;

    perfilId = await Perfil.findOne({ age: { [calculatedAge >= 18 ? '$gte' : '$lt']: 18 } }).select('_id');

    // Se o perfil não for encontrado, retorna erro
    if (!perfilId) {
      return res.status(400).json({ message: `Perfil para ${calculatedAge >= 18 ? 'maiores' : 'menores'} de 18 não encontrado` });
    }
    
    // console.log(req.body)
    // Sempre limitar, para evitar inserção indevidas de dados.
    const add_funcionario = new Funcionario({
      full_name: req.body.full_name,
      date_of_birth: birthDateUTC,
      address: req.body.address,
      email: req.body.email,
      perfil_id: perfilId
    })
    // const add_funcionario = new Funcionario(req.body)

    await add_funcionario.save()
    .then(funcionario => {
      res.status(200).json({ message: "Funcionário criado com sucesso", funcionario })
    })
    .catch(err => {
      res.status(500).json({ message: "Erro ao criar funcionário", error: err })
    })

  } catch (err) {
    res.status(500).json({ 
      message: "Erro ao criar funcionário", 
      error: err 
    });
    console.log(err)
  }
  
}

module.exports = {
  get_all_funcionarios,
  post_add_funcionarios
};