import { Request, Response } from 'express';
import { Medicamento, medicamentoModel } from '../models/medicamentosModel';

const listMedicamentos = (req: Request, res: Response) => {
    medicamentoModel.listMedicamentos()
        .then(medicamentos => {
            res.json(medicamentos)
        })
        .catch(err => console.log(err, "Erro de servidor"));
}

const insertMedicamento = (req: Request, res: Response) => {
    const medicamento = req.body as Medicamento;
    {
        if(!medicamento)
            return console.log(res, "Medicamento inválido")
        if(!medicamento.medicamento)
            return console.log("Informe a descrição do medicamento")
    }
    medicamentoModel.insertMedicamento(medicamento)
        .then(response => {
            res.json({response})
        })
        .catch(err => console.log(err, "Erro de servidor"));
}

export const medicamentoController = {
    insertMedicamento,
    listMedicamentos
};