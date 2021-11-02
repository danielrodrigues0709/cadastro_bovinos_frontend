import { dbQuery, dbQueryFirst } from "../db"
import { MSGS_GERAIS } from "../messages";

export type Medicamento = {
    id: number,
    medicamento: string
}

const listMedicamentos = async () => {
    const retorno = await dbQuery('SELECT * FROM medicamentos');
    return retorno as Medicamento[];
}

const selectMedicamento = async (id: number) => {
    const retorno = await dbQueryFirst('SELECT * FROM medicamentos WHERE id = ?', [id]);
    return retorno as Medicamento;
}

const insertMedicamento = async (medicamento: Medicamento) => {
    await dbQuery('INSERT INTO medicamentos (medicamento) VALUES(?)', [medicamento.medicamento]);
    let retorno = await dbQuery('SELECT seq AS id FROM sqlite_sequence WHERE name = "medicamentos"')
    return MSGS_GERAIS.registroCriado + retorno[0].id;
}

const deleteMedicamento = async (id: number) => {
    await dbQueryFirst('DELETE FROM medicamentos WHERE id = ?', [id]);
}

const updateMedicamento = async (medicamento: Medicamento) => {
    await dbQuery('UPDATE medicamentos SET medicamento = ?', [medicamento.medicamento]);
    return selectMedicamento(medicamento.id);
}

export const medicamentoModel = {
    insertMedicamento,
    listMedicamentos,
    selectMedicamento,
    deleteMedicamento,
    updateMedicamento
}