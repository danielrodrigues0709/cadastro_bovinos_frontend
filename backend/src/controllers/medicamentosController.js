const { listMedicamentos, selectMedicamento, insertMedicamento, deleteMedicamento, updateMedicamento } = require("../models/medicamentosModel");
const { MSGS } = require("../msgs");

module.exports.listMedicamentos = (req, res, next) => {
    listMedicamentos()
        .then(medicamentos => {
            res.json(medicamentos);
            next();
        })
        .catch(err => console.log(err, MSGS.erroServidor));
}

module.exports.insertMedicamento = (req, res, next) => {
    const body = req.body;
    insertMedicamento(body.medicamento)
        .then(response => {
            res.json({response});
            next();
        })
        .catch(err => console.log(err, MSGS.erroServidor));
}

module.exports.selectMedicamento = (req, res, next) => {
    const id = Number(req.params.id);
    selectMedicamento(id)
        .then(response => {
            res.json({response});
            next();
        })
        .catch(err => console.log(err, MSGS.erroServidor));
}

module.exports.deleteMedicamento = (req, res, next) => {
    const id = Number(req.params.id);
    deleteMedicamento(id)
        .then(response => {
            res.json({response});
            next();
        })
        .catch(err => console.log(err, MSGS.erroServidor));
}

module.exports.updateMedicamento = (req, res, next) => {
    const body = req.body;
    const id = Number(req.params.id);
    updateMedicamento(body.medicamento, id)
        .then(response => {
            res.json({response});
            next();
        })
        .catch(err => console.log(err, MSGS.erroServidor));
}