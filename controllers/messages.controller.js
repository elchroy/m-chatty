import db from '../models'
const { Message, User } = db;
import each from 'lodash/each'

import { customResponse } from '../helpers';
import { redisClient } from "../redis";
import { BadRequestError, ServerError, NotFoundError } from '../helpers/errors';

export const createChatMessage = (req, res) => {
	const { authUser, chat, body:{body} } = req;
	Message.create({
		from: authUser.id,
		to: chat.id,
		body
	}).then(async message => {
		const client = await redisClient();
		let msg = {
			message: body,
			from: authUser.username
		}

		client.publish("channels", JSON.stringify(message));
		res.status(201).json(customResponse("success", "New message created", message));
	});

}

// first ensure that the chat id is valid and it exists.
export const getAllChatMessages = async (req, res) => {
	const { chat } = req // destructuring
	const messages = await chat.getMessages();
	// each(messages, msg => {
	// 	// console.log(msg.getSender);
	// })
	res.status(200).json(customResponse("success", "Messages", messages));
}