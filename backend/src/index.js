const express = require('express');
const http = require('http');
const body_parser = require('body-parser');
// const cors = require('cors');

const { Tabelas } = require('./models/tables');
const { MSGS } = require('./msgs');
const { useRoutes } = require('./routes/routes');

const PORT = process.env.PORT || 3333;

const app = express();
module.exports.app = app;

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

// Rota de teste
app.get('/', (req, res) => {
    res.json({msg: "Ok"});
})

// Para uso de rotas
app.use(body_parser.json());
useRoutes(app);

//Cria tabelas
Tabelas.createMedicamentosTable();
// Tabelas.deleteMedicamentosTable();