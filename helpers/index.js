import bcrypt from 'bcrypt-nodejs'
import jwt from 'jsonwebtoken';
import { jwtCreds } from '../config/jwt_creds';

const { secret } = jwtCreds;

export const createPasswordHash = (password) => {
	return bcrypt.hashSync(password);
}

export const createJWTToken = (payload) => {
	return jwt.sign(payload, secret);
}

export const customResponse = (status, message, data) => {
	return { status, message, data }
}

// create the first chat group - "General"
export const prepareFirstChat = async (db) => {
	const username = 'daddyboy';
	
	const result = await db.User.findOrCreate({
		where: { username },
		defaults: {
			username,
			password: createPasswordHash(username)
		}
	});

	const firstUser = result[0];
	const generalChat = await db.Chat.findOrCreate({
		where: {
			UserId: firstUser.id,
			name: 'general'
		}
	});
	// const genChatHasFirstUser = await generalChat.hasUser(firstUser);
	// if (!genChatHasFirstUser) genChatHasFirstUser.addUser(firstUser);
}