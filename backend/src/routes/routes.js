const { Router } = require("express");

const { medicamentoRouter } = require("./medicamentosRoutes");


module.exports.useRoutes = (app) => {
    const apiRouter = Router();

    apiRouter.use('/medicamentos', medicamentoRouter);

    app.use('/api', apiRouter);
}