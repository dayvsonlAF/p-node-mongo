const Funcionario = require('../models/funcionarios');

const get_all_funcionarios = (req, res) => {
  Funcionario.find()
    .then((funcionarios) => {
      return res.status(200).json(funcionarios);
    })
    .catch(err => {
      return res.status(500).json({ message: "Erro ao recuperar dados", error: err });
    })
}

const post_add_funcionarios = (req, res) => {
  console.log(req.body)
  // Sempre limitar, para evitar inserção indevidas de dados.
  const add_funcionario = new Funcionario({
    full_name: req.body.full_name,
    date_of_birth: req.body.date_of_birth,
    address: req.body.address,
    email: req.body.email
  })
  // const add_funcionario = new Funcionario(req.body)

  add_funcionario.save()
    .then(funcionario => {
      res.status(200).json({ message: "Funcionário criado com sucesso", funcionario })
    })
    .catch(err => {
      res.status(500).json({ message: "Erro ao criar funcionário", error: err })
    })
}

module.exports = {
  get_all_funcionarios,
  post_add_funcionarios
};