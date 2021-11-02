import { Request, Response } from 'express';
import { MSGS_GERAIS } from '../messages';
import { Medicamento, medicamentoModel } from '../models/medicamentosModel';

const listMedicamentos = (req: Request, res: Response) => {
    medicamentoModel.listMedicamentos()
        .then(medicamentos => {
            return res.json(medicamentos);
        })
        .catch(err => console.log(err, MSGS_GERAIS.erroServidor));
}

const selectMedicamento = (req: Request, res: Response) => {
    const id = Number(req.params.id);
    {
        if(!id)
            return console.log(res, MSGS_GERAIS.erroRequisicao);
    }
    medicamentoModel.selectMedicamento(id)
        .then(response => {
            return res.json({response});
        })
        .catch(err => console.log(err, MSGS_GERAIS.erroServidor));
}

const insertMedicamento = (req: Request, res: Response) => {
    const medicamento = req.body as Medicamento;
    {
        if(!medicamento)
            return console.log(res, MSGS_GERAIS.erroRequisicao);
        if(!medicamento.medicamento)
            return console.log(MSGS_GERAIS.faltaParametros);
    }
    medicamentoModel.insertMedicamento(medicamento)
        .then(response => {
            return res.json({response});
        })
        .catch(err => console.log(err, MSGS_GERAIS.erroServidor));
}

const deleteMedicamento = (req: Request, res: Response) => {
    const id = Number(req.params.id);
    {
        if(!id)
            return console.log(res, MSGS_GERAIS.faltaParametros);
    }
    medicamentoModel.deleteMedicamento(id)
        .then(() => {
            return res.json({response: `${MSGS_GERAIS.registroDeletado}${id}`});
        })
        .catch(err => console.log(err, MSGS_GERAIS.erroServidor));
}

const updateMedicamento = (req: Request, res: Response) => {
    const medicamento = req.body as Medicamento;
    const id = Number(req.params.id);
    {
        if(!medicamento)
            return console.log(res, MSGS_GERAIS.erroRequisicao);
        if(!medicamento.medicamento)
            return console.log(MSGS_GERAIS.faltaParametros);
    }
    medicamentoModel.updateMedicamento(medicamento)
        .then(() => {
            return res.json({response: `${MSGS_GERAIS.registroAtualizado}${id}`});
        })
        .catch(err => console.log(err, MSGS_GERAIS.erroServidor));
}

export const medicamentoController = {
    insertMedicamento,
    listMedicamentos,
    selectMedicamento,
    deleteMedicamento,
    updateMedicamento
};