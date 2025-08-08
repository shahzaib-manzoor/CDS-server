import { createRule, getRules, getRulesList,updateRule } from '..//controllers/rules.controller';
import {Router} from 'express'; 


const rulesRouter = Router();

rulesRouter.get('/',getRulesList);
rulesRouter.post('/',createRule)
rulesRouter.get('/:id?',getRules);
rulesRouter.put('/:id',updateRule)



export default rulesRouter;
