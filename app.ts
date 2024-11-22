import express from 'express';
import { funcionariosRouter } from './routes/funcionariosRoutes';

const app = express();

// Middleware para permitir JSON no corpo das requisições
app.use(express.json());

// Rotas
app.use('/funcionarios', funcionariosRouter);

export { app }