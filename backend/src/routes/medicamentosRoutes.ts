import Router from 'express';
import { medicamentoController } from '../controllers/medicamentosController';

const medicamentoRouter = Router();

medicamentoRouter.get('/', medicamentoController.listMedicamentos);
medicamentoRouter.post('/', medicamentoController.insertMedicamento);

export {
    medicamentoRouter
}