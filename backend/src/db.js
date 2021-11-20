const { app } = require('electron');
const path = require('path')
const { MSGS } = require('./msgs');

const sqlite3 = require('sqlite3').verbose();

module.exports.openConnection = () => {
    const dbPath = path.join(app.getAppPath(), '/db/cadastro_bovinos.db');
    /**
     * Para debug comentar a variável acima e usar a variável abaixo
     * const dbPath = '../db/cadastro_bovinos.db';
     */

    const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
            console.error(MSGS.erroConexao, err);
        }
        else console.log(MSGS.sucessoConexao);
    });
    return db;
}

module.exports.dbQuery = (query, params) => {
    let db = this.openConnection();
    return new Promise((resolve, reject) => {
        db.all(query, params, (err, rows) => {
            if(err)
                reject(err);
            else
                resolve(rows);
        })
    })
    .finally(() => {
        db.close();
        console.log(MSGS.fechaConexao);
    })
}