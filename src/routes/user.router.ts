import {getUser} from '..//controllers/user.controller';
import {Router} from 'express'; 
import { createValidator } from 'express-joi-validation';


const userRouter = Router();
 


userRouter.get('/get-user/:id',getUser);



export default userRouter;