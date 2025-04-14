import express from 'express';
import userController from '../controllers/userControllers.js';

const userRouter = express.Router();

userRouter.get('/get-logged-user', userController.getLoginUser)
userRouter.get('/get-all-users', userController.getAllUsers)



export default userRouter;