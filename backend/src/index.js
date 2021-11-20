const express = require('express');
const http = require('http');
const cors = require('cors');

const { Tabelas } = require('./models/tables');
const { MSGS } = require('./msgs');

const router = require('./routes/routes');
const medicamentosRouter = require('./routes/medicamentosRoutes');

const PORT = process.env.PORT || 3333;

const app = express();
const httpServer = http.createServer(app);

// Inicia servidor
module.exports.startServer = () => {
  httpServer.listen(PORT, () => console.log(`${MSGS.servidor} ${PORT}`));
}

// Fecha servidor
module.exports.shutDownServer = () => {
    httpServer.close(err => {
      if(err)
          console.log(err);
      else console.log(MSGS.servidorDesligado);
  });
}

// Para uso de rotas
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use('/api', router);
app.use('/medicamentos', medicamentosRouter);

//Cria tabelas
Tabelas.createMedicamentosTable();
// Tabelas.deleteMedicamentosTable();