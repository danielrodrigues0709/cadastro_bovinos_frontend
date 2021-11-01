import sqlite3 from 'sqlite3';
import * as dotenv from "dotenv";

dotenv.config({ path: __dirname+'/.env' });

const DATABASE_FILE = process.env.DATABASE_FILE;

if(!DATABASE_FILE) {
    throw new Error("DATABASE_FILE não informado");
}

export const openConnection = () => {
    let db = new sqlite3.Database(DATABASE_FILE, (err) => {
        if (err) {
          console.error(err, 'Erro ao conectar a base de dados');
        } else
        console.log('Conectado a base cadastro_bovinos.db');
    });
    return db;
};

export const dbQuery = (query: string, params?: any[]) => {
    let db = openConnection();
    return new Promise<any[]>((resolve, reject) => {
        db.all(query, params, (err, rows) => {
            if(err)
                reject(err);
            else
                resolve(rows);
        })
    })
    .finally(() => {
        db.close();
        console.log('Conexão fechada');
    })
}