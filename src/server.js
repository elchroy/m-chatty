import path from 'path';
import http from 'http';
import express from 'express';
import socket from 'socket.io';
import bodyParser from 'body-parser';

import { verifyAuth } from '../middlewares'
import { authRouter, userRouter, messageRouter, chatRouter } from '../routers'
import { socketController } from '../controllers/sockets.controller'

const app = express();// create an express app
const server = http.createServer(app);// create a server with the app.
const io = socket.listen(server);// ask socket to listen to that server.

app.use(express.static("public"))// for our frontend assets.

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json());

app.get("/", (req, res, next) => {
	// https://stackoverflow.com/questions/26079611/node-js-typeerror-path-must-be-absolute-or-specify-root-to-res-sendfile-failed
	res.sendFile('/public/index.html', { root: '.' });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/chats", chatRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/messages", verifyAuth, messageRouter);




const PORT = 9000;
const hostname = 'http://localhost'
server.listen(PORT, () => console.log(`App listening on ${hostname}:${PORT}`));

socketController(io)










// app.all("*", (req, res) => {
// 	res.json("mnone")
// })



