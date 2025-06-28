import express from "express";
import chatsController from "../controllers/chatsController.js";

const chatsRouter = express.Router();

chatsRouter.get("/get-all-chats",chatsController.getUserChats); 
chatsRouter.get("/get-chat/:chatId",chatsController.getChatbyId); 

export default chatsRouter;