import { Router } from "express";

import { funcionariosController } from '../controllers/funcionariosController';

const funcionariosRouter = Router();

funcionariosRouter.get('/', funcionariosController.get_all_funcionarios);
funcionariosRouter.get('/filter/:filter/:page', funcionariosController.get_filtered_funcionarios);
funcionariosRouter.post('/add', funcionariosController.post_add_funcionarios);

export { funcionariosRouter }