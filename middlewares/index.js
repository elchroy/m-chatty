import jwt from 'jsonwebtoken';
import { jwtCreds } from '../config/jwt_creds'
import "babel-polyfill";
import { BadRequestError, ServerError, NotFoundError } from '../helpers/errors';

import db from '../models'
const { Chat, User } = db;

const { secret } = jwtCreds;

export const verifySignUp = async (req, res, next) => {
	const { username, password } = req.body || ""
	if (!username || !password) {
		next(new BadRequestError('Username/Password are required', 400))
	} else {
		const genChat = await Chat.findOne({
			where: { name: "general" }
		});
		req.genChat = genChat;
		next();
	}
}

export const verifyAuth = async (req, res, next) => {
	
	const { authorization } = req.headers
	if (!authorization) next(new BadRequestError("Authorization token is required.", 400));
	
	try {
		const { username, id } = jwt.verify(authorization, secret)
		req.authUser = await User.findOne({ where: { id } });
		next();
	} catch(e) {
		next(new BadRequestError("Token is invalid", 500));
		res.status(500).json({message: ""})
	}
}

export const verifyChat = (req, res, next) => {
	const { authUser:{ id }, params:{ chatId } } = req // destructuring
	Chat.findOne({ where:{ id:chatId } }).then(chat => {
		if (!chat) next(new NotFoundError('Chat not found'));
		req.chat = chat;
		next()
	})
}