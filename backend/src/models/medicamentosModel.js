const { DB } = require("../db");
const { MSGS } = require("../msgs");

module.exports.listMedicamentos = async () => {
    const retorno = await DB.dbQuery(`SELECT * FROM medicamentos`, []); 
    return retorno;
}

module.exports.insertMedicamento = async (medicamento) => {
    await DB.dbQuery(`INSERT INTO medicamentos(medicamento) VALUES('${medicamento}')`);
    const retorno = await DB.dbQuery('SELECT seq AS id FROM sqlite_sequence WHERE name = "medicamentos"')
    return `${MSGS.registroCriado} ${retorno[0].id}`;
}

module.exports.selectMedicamento = async (id) => {
    const retorno = await DB.dbQuery(`SELECT * FROM medicamentos WHERE id = ${id}`);
    return retorno;
}

module.exports.deleteMedicamento = async (id) => {
    await DB.dbQuery(`DELETE FROM medicamentos WHERE id = ${id}`);
    return `${MSGS.registroDeletado} ${id}`; 
}

module.exports.updateMedicamento = async (medicamento, id) => {
    await DB.dbQuery(`UPDATE medicamentos SET medicamento = '${medicamento}' WHERE id = ${id}`);
    return this.selectMedicamento(id);
}