import { Application, Router } from "express";

import { medicamentoRouter } from "./medicamentosRoutes";


export const useRoutes = (app: Application) => {
    const apiRouter = Router();

    apiRouter.use('/medicamentos', medicamentoRouter);

    app.use('/api', apiRouter);
}