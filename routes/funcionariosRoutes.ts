import { Router } from "express";

import FuncionarioController from '../controllers/funcionariosController';

const funcionariosRouter = Router();

funcionariosRouter.get('/', FuncionarioController.getAllFuncionario);
funcionariosRouter.get('/filter/:filter/:page', FuncionarioController.get_filtered_funcionarios);
funcionariosRouter.post('/add', FuncionarioController.post_add_funcionarios);

export { funcionariosRouter }