import express from 'express';
import userController from '../controllers/userControllers.js';

const userRouter = express.Router();

userRouter.get('/get-logged-user', userController.getLoginUser)
userRouter.get('/get-all-users', userController.getAllUsers)
userRouter.get('/search', userController.userSearch)


export default userRouter;