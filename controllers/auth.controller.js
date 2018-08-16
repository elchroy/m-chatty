import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt-nodejs'

import { jwtCreds } from '../config/jwt_creds'
import db from '../models'

const { User } = db;
const { secret } = jwtCreds;

export const signup = (req, res) => {
	
	const { username, password } = req.body;
	
	User.create({
		username,
		password: createPasswordHash(password)
	}).then(user => {
		const { id, username } = user;
		const token = createJWTToken({ id, username });
		
		res.status(201).json({ username, token })
	}).catch(err => res.status(500).json({
		message: "There was an error"
	}));
}


export const signin = (req, res) => {

	const { username, password } = req.body;
	
	User.findOne({ where:{username} }).then(user => {
		if (!user || !bcrypt.compareSync(password, user.password)) {
			res.status(400).json({
				message: "Signin not successful. Invalid username/password.",
			});
		} else {
			const { id, username } = user;
			res.status(200).json({
				id,
				username,
				message: "Signin successful",
				token: createJWTToken({ id, username })
			})
		}
	}).catch(err => res.status(500).json({
		message: "There was an error"
	}))
}

const createJWTToken = (payload) => {
	return jwt.sign(payload, secret);

}

const createPasswordHash = (password) => {
	return bcrypt.hashSync(password);

}