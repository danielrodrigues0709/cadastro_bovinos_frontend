const { listMedicamentos, selectMedicamento, insertMedicamento, deleteMedicamento, updateMedicamento } = require("../models/medicamentosModel");
const { MSGS } = require("../msgs");

module.exports.listMedicamentos = (req, res) => {
    listMedicamentos()
        .then(medicamentos => {
            return res.json(medicamentos);
        })
        .catch(err => console.log(err, MSGS.erroServidor));
}

module.exports.insertMedicamento = (req, res) => {
    const body = req.body;
    insertMedicamento(body.medicamento)
        .then(response => {
            return res.json({response});
        })
        .catch(err => console.log(err, MSGS.erroServidor));
}

module.exports.selectMedicamento = (req, res) => {
    const id = Number(req.params.id);
    selectMedicamento(id)
        .then(response => {
            return res.json({response});
        })
        .catch(err => console.log(err, MSGS.erroServidor));
}

module.exports.deleteMedicamento = (req, res) => {
    const id = Number(req.params.id);
    deleteMedicamento(id)
        .then(response => {
            return res.json({response});
        })
        .catch(err => console.log(err, MSGS.erroServidor));
}

module.exports.updateMedicamento = (req, res) => {
    const body = req.body;
    const id = Number(req.params.id);
    updateMedicamento(body.medicamento, id)
        .then(response => {
            return res.json({response});
        })
        .catch(err => console.log(err, MSGS.erroServidor));
}