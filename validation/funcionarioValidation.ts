import Joi from 'joi';
import { IFuncionario } from '../interfaces/IFuncionario';
/*

O this.schema é uma propriedade da classe que armazena o esquema de validação definido com a biblioteca Joi. Ele contém as regras para validar os dados recebidos no método validate.

A necessidade do constructor é inicializar a propriedade this.schema quando a classe é instanciada. Ele configura a estrutura de validação da classe para que você não precise recriar o esquema toda vez que o método validate for chamado.

Explicando o this.schema:
É o local onde as regras de validação (como campos obrigatórios, formatos válidos, etc.) são definidas.
Essas regras são usadas pelo método validate para validar os dados recebidos.

*/

class FuncionarioValidation {
  
  schema: Joi.ObjectSchema;
  
  constructor(){
    this.schema = Joi.object({
      full_name: Joi.string().min(3).max(100).required().messages({
        'string.empty': 'O nome completo é obrigatório.',
        'string.min': 'O nome completo deve ter no mínimo 3 caracteres.',
        'string.max': 'O nome completo deve ter no máximo 100 caracteres.',
      }),
      date_of_birth: Joi.date().less('now').required().messages({
        'date.base': 'A data de nascimento deve ser uma data válida.',
        'date.less': 'A data de nascimento deve ser no passado.',
        'any.required': 'A data de nascimento é obrigatória.',
      }),
      address: Joi.string().min(5).max(200).required().messages({
        'string.empty': 'O endereço é obrigatório.',
        'string.min': 'O endereço deve ter no mínimo 5 caracteres.',
        'string.max': 'O endereço deve ter no máximo 200 caracteres.',
      }),
      email: Joi.string().email().required().messages({
        'string.email': 'O e-mail deve ser válido.',
        'string.empty': 'O e-mail é obrigatório.',
      })
    })
  }

  // O Joi.validate retorna um objeto com a propriedade error
  validate(data: IFuncionario): { error: string[] | null }{
    const { error } = this.schema.validate(data, { abortEarly: false });
    if (error) {
      return {error: error.details.map((err) => err.message)};
    }
    return {error: null};
  }
}

export default new FuncionarioValidation();