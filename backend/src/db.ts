import sqlite3 from 'sqlite3';
import * as dotenv from "dotenv";
import { MSGS_GERAIS } from './messages';

dotenv.config({ path: __dirname+'/.env' });

const DATABASE_FILE = process.env.DATABASE_FILE;

if(!DATABASE_FILE) {
    throw new Error(MSGS_GERAIS.erroDBFile);
}

export const openConnection = () => {
    let db = new sqlite3.Database(DATABASE_FILE, (err) => {
        if (err) {
          console.error(err, MSGS_GERAIS.erroConexao);
        } else
        console.log(MSGS_GERAIS.sucessoConexao);
    });
    return db;
};

export const dbQueryFirst = async (query: string, params?: any[]) => {
    const retorno = await dbQuery(query, params);
    return retorno[0];
}

export const dbQuery = (query: string, params?: any[]) => {
    let db = openConnection();
    return new Promise<any[]>((resolve, reject) => {
        db.all(query, params, (err, rows) => {
            console.log(query, params, err, rows)
            if(err)
                reject(err);
            else
                resolve(rows);
        })
    })
    .finally(() => {
        db.close();
        console.log(MSGS_GERAIS.fechaConexao);
    })
}