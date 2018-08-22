import path from 'path';
import http from 'http';
import express from 'express';
import socket from 'socket.io';

import { socketController } from '../controllers/sockets.controller';
import { redisClient } from "../redis";
import app from './app';

const PORT = 9000;
const hostname = 'http://localhost'

redisClient().then(client => {
	const server = http.createServer(app);// create a server with the app.
	server.listen(PORT, () => console.log(`App listening on ${hostname}:${PORT}`));
	
	const io = socket.listen(server);// ask socket to listen to that server.
	
	io.on("connection", socket => {
		client.subscribe("channels");
		client.on("message", (channel, message) => {
			const msg = JSON.parse(message);
			socket.emit("newMessage", msg);
		});
	});
}).catch(err => console.log(err));