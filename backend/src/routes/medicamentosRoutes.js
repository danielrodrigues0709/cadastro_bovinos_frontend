const express = require('express');
const medicamentosRouter = express.Router();

const { listMedicamentos, insertMedicamento, selectMedicamento, deleteMedicamento, updateMedicamento } = require('../controllers/medicamentosController');

medicamentosRouter.get('/', listMedicamentos);
medicamentosRouter.get('/:id', selectMedicamento);
medicamentosRouter.post('/', insertMedicamento);
medicamentosRouter.delete('/:id', deleteMedicamento);
medicamentosRouter.patch('/:id', updateMedicamento);

module.exports = medicamentosRouter;