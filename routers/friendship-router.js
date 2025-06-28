import express from "express";
import friendshipController from "../controllers/friendshipController.js";

const friendshipRouter = express.Router();

friendshipRouter.post("/send-request/:receiverId",friendshipController.sendRequest); 
friendshipRouter.post("/accept-request/:requestId",friendshipController.acceptRequest);
friendshipRouter.post("/reject-request/:requestId",friendshipController.rejectRequest); 
friendshipRouter.post("/cancel-request/:requestId",friendshipController.cancelRequest);
friendshipRouter.get("/get-pending-requests",friendshipController.getPendingRequests);

export default friendshipRouter;