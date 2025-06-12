import express from 'express';
import userController from '../controllers/userControllers.js';
import { updateProfileValidationRules } from '../middlewares/validators/authValidators.js';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

const userRouter = express.Router();

const uploadPath = path.join('uploads', 'profile-pics');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const originalName = file.originalname;
        const sanitized = originalName
            .replace(/\s+/g, '-')
            .replace(/[^a-zA-Z0-9._-]/g, '');
        const uniqueName = `${Date.now()}-${sanitized}`;
        cb(null, uniqueName);
    }
});
const upload = multer({
    storage,
    limits: { fileSize: 20 * 1024 * 1024 }, // 20MB limit
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Only image are allowed'), false);
        }
        cb(null, true);
    }
});


userRouter.get('/get-logged-user', userController.getLoginUser)
userRouter.get('/get-all-users', userController.getAllUsers)
userRouter.get('/search', userController.userSearch)
userRouter.get('/check-username', userController.checkUsername)
userRouter.put('/update-profile', updateProfileValidationRules, userController.updateProfile)
userRouter.post('/change-password', userController.changePassword)
userRouter.post('/update-profile-pic', upload.single('profilePic'), userController.updateProfilePic)


export default userRouter;