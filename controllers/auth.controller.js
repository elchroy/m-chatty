import bcrypt from 'bcrypt-nodejs';
import db from '../models'
import { createPasswordHash, createJWTToken, customResponse } from '../helpers';
import { BadRequestError, NotFoundError, ServerError } from '../helpers/errors'

const { User } = db;

export const signup = (req, res, next) => {
	const { username, password } = req.body;
	
	User.create({
		username,
		password: createPasswordHash(password)
	}).then(async user => {
		await req.genChat.addUser(user);
		const { id, username } = user;
		const token = createJWTToken({ id, username });
		res.status(201).json(customResponse("success", "Signup successful", { id, username, token }))
	}).catch(err => next(new BadRequestError('Username already taken.')));
}


export const signin = (req, res, next) => {

	const { username, password } = req.body;
	
	User.findOne({ where:{username} }).then(user => {
		if (!user || !bcrypt.compareSync(password, user.password)) {
			next(new NotFoundError('Signin failure - Invalid username/password.'))
		} else {
			const { id, username } = user;
			res.status(200).json(customResponse("success", "Signin successful", {
				username,
				token: createJWTToken({ id, username })
			}));
		}
	}).catch(err => next(new ServerError()))
}