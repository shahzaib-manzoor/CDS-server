import { Router } from 'express';
import { userValidations as validations } from '../validations';
import { login, signUp, passwordReset, refreshToken, changePassword } from "../controllers/auth.controller";
import { validateData } from '..//middlewares/validate-middleware';
 

const authRouter = Router();
 
authRouter.post('/login', validateData( validations.userLoginSchema), login);
authRouter.post('/sign-up', validateData( validations.userRegistrationSchema), signUp);
authRouter.post('/password-reset', validateData( validations.resetEmailSchema), passwordReset);
authRouter.post('/change-password', validateData( validations.changePasswordSchema), changePassword);
authRouter.post('/refresh-token', refreshToken);

export default authRouter;