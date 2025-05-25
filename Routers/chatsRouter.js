import express from "express";
import chatsController from "../controllers/chatsController.js";

const chatsRouter = express.Router();

chatsRouter.get("/get-all-chats",chatsController.getUserChats); 

export default chatsRouter;