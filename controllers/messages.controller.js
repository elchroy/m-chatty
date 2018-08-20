import db from '../models'
const { Message, User } = db;

import { customResponse } from '../helpers';
import { BadRequestError, ServerError, NotFoundError } from '../helpers/errors';

// first ensure that the chat id is valid and it exists.
export const createChatMessage = (req, res) => {
	const { authUser:{id}, chat, body:{body} } = req;
	Message.create({
		from: id,
		to: chat.id,
		body
	}).then(message => {
		res.status(201).json(customResponse("success", "New message created", message));
	});

}

// first ensure that the chat id is valid and it exists.
export const getAllChatMessages = async (req, res) => {
	const { chat } = req // destructuring

	const messages = await chat.getMessages();

	res.status(200).json(customResponse("success", "Messages", messages));
}