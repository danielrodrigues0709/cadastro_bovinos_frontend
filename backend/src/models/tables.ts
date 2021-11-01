import { dbQuery } from "../db"

const medicamentosTable = () => {
    const retorno = dbQuery('CREATE TABLE IF NOT EXISTS medicamentos (id INTEGER PRIMARY KEY AUTOINCREMENT, medicamento STRING)');
    return retorno;
}

export const tables = {
    medicamentosTable
}