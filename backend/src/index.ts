import express from 'express';
import bodyParser from 'body-parser';
import { useRoutes } from './routes/routes';
import { tables } from './models/tables';
import { MSGS_GERAIS } from './messages';

const PORT = process.env.PORT || 3333;
const app = express();
app.use(bodyParser.json());

app.listen(PORT, () => console.log(MSGS_GERAIS.servidor+PORT));

// Rota de teste
app.get('/', (req, res) => {
    res.json({msg: "Ok"})
})

// Cria tabelas
tables.medicamentosTable();

useRoutes(app);