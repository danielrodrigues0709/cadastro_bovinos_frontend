const Router = require('express');
const { listMedicamentos, insertMedicamento, selectMedicamento, deleteMedicamento, updateMedicamento } = require('../controllers/medicamentosController');

const medicamentoRouter = Router();

medicamentoRouter.get('/', listMedicamentos);
medicamentoRouter.get('/:id', selectMedicamento);
medicamentoRouter.post('/', insertMedicamento);
medicamentoRouter.delete('/:id', deleteMedicamento);
medicamentoRouter.patch('/:id', updateMedicamento);

module.exports = {medicamentoRouter};