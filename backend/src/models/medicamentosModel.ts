import { dbQuery } from "../db"

export type Medicamento = {
    id: number,
    medicamento: string
}

const listMedicamentos = async () => {
    const retorno = await dbQuery('SELECT * FROM medicamentos');
    return retorno as Medicamento[];
}

const insertMedicamento = async (medicamento: Medicamento) => {
    await dbQuery('INSERT INTO medicamentos (medicamento) VALUES(?)', [medicamento.medicamento]);
    return ('Medicamento criado');
}

export const medicamentoModel = {
    insertMedicamento,
    listMedicamentos
}