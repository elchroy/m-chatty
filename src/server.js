import path from 'path';
import http from 'http';
import express from 'express';
import socket from 'socket.io';

import { socketController } from '../controllers/sockets.controller';
import app from './app';

const server = http.createServer(app);// create a server with the app.
const io = socket.listen(server);// ask socket to listen to that server.

const PORT = 9000;
const hostname = 'http://localhost'
server.listen(PORT, () => console.log(`App listening on ${hostname}:${PORT}`));

socketController(io)










// app.all("*", (req, res) => {
// 	res.json("mnone")
// })



