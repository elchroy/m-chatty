import jwt from 'jsonwebtoken';
import { jwtCreds } from '../config/jwt_creds'
import "babel-polyfill";

import db from '../models'
const { Chat, User } = db;

const { secret } = jwtCreds;

export const verifySignUp = (req, res, next) => {
	const { username, password } = req.body || ""
	// check if username is present.
	// check if username is unique.
	if (!username || !password) {
		res.status(400).json({
			// @todo Better error handling/messaging
			message: 'Username/Password are required'
		})
	} else {
		next();
	}
}


export const verifyAuth = async (req, res, next) => {
	
	const { authorization } = req.headers
	if (!authorization) res.status(400).json({message: "Authorization token is required."})
	
	try {
		const decoded = jwt.verify(authorization, secret)
		const { username, id } = decoded
		req.authUser = await User.findOne({ where: { id } });
		next();
	} catch(e) {
		res.status(400).json({message: "Invalid Token"})
	}
}

export const verifyChat = (req, res, next) => {
	const { authUser:{ id }, params:{ chatId } } = req // destructuring
	Chat.findOne({
		where: {
			id: chatId
		}
	}).then(chat => {
		if (!chat) {
			res.json({ message: 'Chat not found' })
		}
		req.chat = chat;
		next()
	})
}