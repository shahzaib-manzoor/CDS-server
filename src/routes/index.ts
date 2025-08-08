import {Router} from 'express';

import authRouter from './auth.router';
import userRouter from './user.router';
import ruleRouter from './rules.router';
import nodeRouter from './node.router';
import treeRouter from './tree.router';
import configRouter from './configs.router';

const baseRouter = Router();

baseRouter.use('/auth',authRouter)
baseRouter.use('/user',userRouter)
baseRouter.use('/rules',ruleRouter)
baseRouter.use('/node',nodeRouter)
baseRouter.use('/tree',treeRouter)
baseRouter.use('/configs',configRouter)



export default baseRouter;