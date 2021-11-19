const express = require('express');
const medicamentosRouter = express.Router();

const body_parser = require('body-parser');
// const cors = require('cors');

const { listMedicamentos, insertMedicamento, selectMedicamento, deleteMedicamento, updateMedicamento } = require('../controllers/medicamentosController');

medicamentosRouter.use(body_parser.json());
// medicamentosRouter.use(cors);

medicamentosRouter.get('/', listMedicamentos);
medicamentosRouter.get('/:id', selectMedicamento);
medicamentosRouter.post('/', insertMedicamento);
medicamentosRouter.delete('/:id', deleteMedicamento);
medicamentosRouter.patch('/:id', updateMedicamento);

module.exports = medicamentosRouter;