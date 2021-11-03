import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import { useRoutes } from './routes/routes';
import { tables } from './models/tables';
import { MSGS_GERAIS } from './messages';

const PORT = process.env.PORT || 3333;
const FRONT_PORT = 4200;
const app = express();

// Config CORS
const allowedOrigins = [`http://localhost:${FRONT_PORT}`];
const options: cors.CorsOptions = {
  origin: allowedOrigins
};

app.use(cors(options));

app.use(express.json());

app.use(bodyParser.json());

app.listen(PORT, () => console.log(MSGS_GERAIS.servidor+PORT));

// Rota de teste
app.get('/', (req, res) => {
    res.json({msg: "Ok"})
})

// Cria tabelas
tables.medicamentosTable();

useRoutes(app);