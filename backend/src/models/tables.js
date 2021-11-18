const { DB } = require("../db");
const { MSGS } = require("../msgs");

const db =  DB.openConnection();

class Tabelas {
    createMedicamentosTable() {
        db.run(`CREATE TABLE IF NOT EXISTS medicamentos (id INTEGER PRIMARY KEY AUTOINCREMENT,medicamento STRING)`, (err) => {
            if(err) {
                console.log('Erro ao criar tabela', err);
            }
            else {
                console.log('Tabela medicamentos criada');
            }
        })

        db.close(() => {
            console.log(MSGS.fechaConexao);
        });
    }

    deleteMedicamentosTable() {
        db.run(`DROP TABLE medicamentos`, (err) => {  
            if(err) {
                console.log(err);
            }
            else console.log('Tabela medicamentos deletada');
        });

        db.close(() => {
            console.log(MSGS.conexaoFechada);
        });
    }
}

module.exports.Tabelas = new Tabelas();