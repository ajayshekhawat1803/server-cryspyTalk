import express from 'express';
import userController from '../controllers/userControllers.js';
import { updateProfileValidationRules } from '../middlewares/validators/authValidators.js';

const userRouter = express.Router();

userRouter.get('/get-logged-user', userController.getLoginUser)
userRouter.get('/get-all-users', userController.getAllUsers)
userRouter.get('/search', userController.userSearch)
userRouter.get('/check-username', userController.checkUsername)
userRouter.put('/update-profile', updateProfileValidationRules, userController.updateProfile)
userRouter.post('/change-password', userController.changePassword)
userRouter.post('/update-profile-pic', userController.userSearch)


export default userRouter;