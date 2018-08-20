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