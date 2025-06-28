import express from "express";
import messageController from "../controllers/messageController.js";
import { sendNewMsgValidationRules } from "../middlewares/validators/messageValidators.js";
import multer from 'multer';
import fs from 'fs';
import path from 'path';

const msgRouter = express.Router();

const uploadPath = path.join('uploads', 'messages');
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
        if (!file.mimetype.startsWith('image/') && !file.mimetype.startsWith('video/')) {
            return cb(new Error('Only image and video files are allowed'), false);
        }
        cb(null, true);
    }
});



msgRouter.post("/send-message", upload.single('media'), sendNewMsgValidationRules, messageController.sendNewMessage);
msgRouter.get("/get-messages/:chatId", messageController.getMessagesByChatId);

export default msgRouter;