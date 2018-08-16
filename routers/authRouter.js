import express from 'express';
import { signup, signin } from '../controllers/auth.controller'
import { verifySignUp } from '../middlewares'

const authRouter = express.Router();

authRouter.post("/signup", verifySignUp, signup);
authRouter.post("/signin", signin);

export default authRouter;