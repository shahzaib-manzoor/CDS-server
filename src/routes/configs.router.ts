import { Router } from 'express';
import { createConfig, getAllConfigs, getConfigById, updateConfigById, deleteConfigById } from "../controllers/configs.controller";

const configRouter = Router();

configRouter.post('/', createConfig);
configRouter.get('/', getAllConfigs);
configRouter.get('/:id', getConfigById);
configRouter.put('/:id', updateConfigById);
configRouter.delete('/:id', deleteConfigById);

export default configRouter;