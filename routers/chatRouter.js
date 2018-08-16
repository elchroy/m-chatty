import express from 'express';
import { verifyAuth, verifyChat } from '../middlewares'
import { createChat, getAllUserChats, getOneUserChat, joinChat } from '../controllers/chats.controller.js'
import { createChatMessage, getAllChatMessages } from '../controllers/messages.controller.js'
const chatRouter = express.Router();

chatRouter.get("/", verifyAuth, getAllUserChats);
chatRouter.post("/", verifyAuth, createChat);

chatRouter.get("/:chatId", verifyAuth, verifyChat, getOneUserChat);
chatRouter.post("/:chatId/join", verifyAuth, verifyChat, joinChat);

// get all messages in a particular chat.
chatRouter.get("/:chatId/messages", verifyAuth, verifyChat, getAllChatMessages);

// post one message to a particular chat.
chatRouter.post("/:chatId/messages", verifyAuth, verifyChat, createChatMessage);

export default chatRouter;