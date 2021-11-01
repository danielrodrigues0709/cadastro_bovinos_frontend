import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import bodyParser from 'body-parser';
import { useRoutes } from './routes/routes';
import { tables } from './models/tables';

const PORT = process.env.PORT || 3333;
const app = express();
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.json({msg: "Ok"})
})

tables.medicamentosTable();
useRoutes(app);

app.listen(PORT, () => console.log("Servidor rodando na porta "+PORT));