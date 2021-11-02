import { dbQuery } from "../db"
import { MEDICAMENTOS_MSGS } from "../messages";

const medicamentosTable = () => {
    const retorno = dbQuery('CREATE TABLE IF NOT EXISTS medicamentos (id INTEGER PRIMARY KEY AUTOINCREMENT, medicamento STRING)');
    console.log(MEDICAMENTOS_MSGS.tabelaCriada)
    return retorno;
}

export const tables = {
    medicamentosTable
}