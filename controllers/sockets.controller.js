import bcrypt from 'bcrypt-nodejs';
import db from '../models';
import uuidv4 from 'uuid/v4'

const { Message, Channel, User } = db;

export const socketController = (io) => {

	io.sockets.on('connection', client => {

		client.on("POST_MESSAGE", messagePayload => {
			const { from, to, message } = messagePayload;
			Message.create({
				author: from.id,
				to: to.id,
				body: message
			}).then(result => {
				const { author, to, body, updatedAt } = result;
				io.sockets.emit("MESSAGE_POSTED", { author, to, body, updatedAt })
			}).catch();
		})
	});
}


// io.sockets.on('connection', client => {
// 	console.log("Client connected...");
// 	client.on("POST_MESSAGE", conversatonsController.postMessage)
// 	client.on("POST_MESSAGE", data => {
// 		console.log(data, "the is the data from the client")
// 		// client.emit("thread", data); // send only to the client that sent the message
// 		// client.broadcast.emit("thread", data); // send to all other clients apart from the sending client.
// 		io.sockets.emit("thread", data); // send to all the clients that are connected.
// 	});
// })
