import db from '../models'
const { User, Chat, UserChat } = db;
import { createPasswordHash, createJWTToken, customResponse } from '../helpers';
import { NotFoundError } from '../helpers/errors'

export const createChat = async (req, res) => {
	const { authUser, body: {name} } = req;

	const chat = await Chat.create({
		UserId: authUser.id,
		name
	});

	await chat.addUser(authUser);

	res.status(201).json(customResponse("success", "New chat created", chat));
}

/**
 * Get all the chats that this user has subscribed to, like all the rooms
 */
export const getAllUserChats = async (req, res, next) => {
	const { authUser } = req // destructuring

	const userChats = await authUser.getChats({
		attributes: ['id', 'name']
	});
	
	res.status(201).json(customResponse("success", "Chats", userChats));
}

/**
 * Get all the chats 
 */
export const getAllChats = async (req, res, next) => {
	const { authUser } = req // destructuring

	const chats = await Chat.findAll({
		attributes: ['id', 'name']
	});
	
	res.status(201).json(customResponse("success", "Chats", chats));
}

export const getOneChat = (req, res) => {
	const { chat } = req // destructuring
	res.status(200).json(customResponse("success", "Chat found", chat));
}

export const getOneUserChat = (req, res) => {
	const { authUser:{ id }, chat } = req // destructuring
	if (chat.UserId != id) {
		res.status(404).json({
			message: "not found" // the chat exists but belongs to another user.??
		})
	} else {
		res.status(200).json({
			message: "success",
			chat
		});
	}
}

/**
 * Join a given chat
 */
export const joinChat = async (req, res) => {
	const { authUser, chat } = req // destructuring
	
	const chathasUser = await chat.hasUser(authUser);
	if(!chathasUser) {
		await chat.addUser(authUser);
		res.status(200).json(customResponse("success", "Successfully joined chat.", chat));
	} else {
		res.status(200).json(customResponse("failure", "Already in chat.", chat));
	}
}