import express from 'express';
import { getAll } from '../controllers/users.controller'
import { verifyAuth } from '../middlewares'

const userRouter = express.Router();

userRouter.get("/", verifyAuth, getAll);

export default userRouter;