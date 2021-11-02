import Router from 'express';
import { medicamentoController } from '../controllers/medicamentosController';

const medicamentoRouter = Router();

medicamentoRouter.get('/', medicamentoController.listMedicamentos);
medicamentoRouter.get('/:id', medicamentoController.selectMedicamento);
medicamentoRouter.post('/', medicamentoController.insertMedicamento);
medicamentoRouter.delete('/:id', medicamentoController.deleteMedicamento);
medicamentoRouter.patch('/:id', medicamentoController.updateMedicamento);

export {
    medicamentoRouter
}