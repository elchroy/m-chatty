import 'babel-polyfill';
import jwt from 'jsonwebtoken';
import chaiHttp from 'chai-http';
import chai, { expect } from 'chai';

import db from '../models'
import app from '../src/app';
import { truncateDB } from './helpers';
import { createPasswordHash, createJWTToken } from '../helpers'

chai.use(chaiHttp)

describe('Chat', () => {

	let authUser1, authUser2,
	chat1, chat2,
	authUserToken1, authUserToken2,
	endpoint = '/api/v1/chats';

	before(async () => {
		await truncateDB();

		authUser1 = await db.User.create({
			username: 'footest',
			password: createPasswordHash('bartest')
		});
		authUser2 = await db.User.create({
			username: 'palmest',
			password: createPasswordHash('bartest')
		});

		chat1 = await db.Chat.create({
			UserId: authUser1.id,
			name: "Test Chat Channel Name"
		});
		chat2 = await db.Chat.create({
			UserId: authUser2.id,
			name: "Another Chat Channel Name"
		});

		await chat1.addUser(authUser1)
		await chat2.addUser(authUser2)

		const { id, username } = authUser1;
		authUserToken1 = createJWTToken({ id, username })
		authUserToken2 = createJWTToken({ id, username });
	});

	const chatRequest = () => {
		return chai.request(app)
	}

	describe('POST /api/v1/chats', () => {
		it('should create a new chat channel with Channel name.', done => {
			db.Chat.count().then(count => expect(count).to.equal(2))
			chatRequest()
			.post(endpoint)
			.set('Authorization', authUserToken1)
			.send({ name: 'Test Channel Name' })
			.end(async (err, res) => {
				expect(res).to.be.json
				expect(res).to.have.status(201)
				expect(res.body.message).to.equal('success')
				expect(res.body.chat.name).to.equal('Test Channel Name')
				db.Chat.count().then(count => expect(count).to.equal(3))
				done()
			});
		});
	});

	describe('GET /api/v1/chats', () => {
		it('should get all the chats the user is suscribed to', done => {
			chatRequest()
			.get(endpoint)
			.set('Authorization', authUserToken1)
			.end((err, res) => {
				expect(res).to.be.json
				expect(res).to.have.status(200)
				expect(typeof res.body).to.equal('object')
				authUser1.getChats().then(userChats => {
					expect(userChats).to.have.length(2)
				});
				done();
			});
		});
	});

	describe('GET /api/v1/chats/:chatId', () => {
		it('should return 404 if the chat does not exist.', done => {
			chatRequest()
			.get(`${endpoint}/100000000`)
			.set('Authorization', authUserToken2)
			.end((err, res) => {
				expect(res).to.be.json
				expect(res).to.have.status(404)
				expect(res.body.message).to.equal('Chat not found')
				done();
			})
		});

		it('should get one chat that the user is suscribed to', done => {
			chatRequest(app)
			.get(`${endpoint}/${chat2.id}`)
			.set('Authorization', authUserToken1)
			.end((err, res) => {
				expect(res).to.be.json
				expect(res).to.have.status(200)
				expect(res.body.chat.name).to.equal('Another Chat Channel Name')
				done();
			})
		});
	});

	describe('GET /api/v1/chats/:chatId/join', () => {
		it('should not allow joining an already joined chat', done => {
			chatRequest(app)
			.post(`${endpoint}/${chat1.id}/join`) // add user1 to chat2
			.set('Authorization', authUserToken1)
			.end((err, res) => {
				expect(res.body.message).to.equal('Already in chat.') // user1 has alread joined chat1.
				chat2.getUsers().then(chatUsers => {
					expect(chatUsers).to.have.length(1); // only user1
				});
				done();
			});
		});

		it('should allow a user to join a given chatId', done => {
			chatRequest(app)
			.post(`${endpoint}/${chat2.id}/join`) // add user1 to chat2
			.set('Authorization', authUserToken1)
			.end((err, res) => {
				expect(res.body.message).to.equal('Successfully joined chat.')
				chat2.getUsers().then(chatUsers => {
					expect(chatUsers).to.have.length(2); // both user1 and user2
				});
				done();
			});
		});
	});

	describe('POST /api/v1/chatId/messages', () => {
		it('should create a new message in a chat', done => {
			chatRequest()
			.post(`${endpoint}/${chat1.id}/messages`)
			.set('Authorization', authUserToken1)
			.send({ body: 'Hello @channel'})
			.end((err, res) => {
				expect(res).to.have.status(201);
				expect(res).to.be.json;
				expect(res.body).to.have.property('body')
				expect(res.body.body).to.equal('Hello @channel')
				done();
			})
		});

		after(async () => {
			await db.Message.destroy({
				where: {}
			})
		});
	});

	const createMessage = (body) => {
		return db.Message.create({
			body,
			from: authUser1.id,
			to: chat1.id
		});
	}
	describe('GET /api/v1/chat/:chatId/messages', () => {

		before(async () => {
			// create new messages from authUser1
			await createMessage('This is a first message');
			await createMessage('This is a second message');
		});

		it('should get all the messages from this user in a chat', done => {
			chatRequest(app)
			.get(`${endpoint}/${chat1.id}/messages`)
			.set('Authorization', authUserToken1)
			.end((err, res) => {
				expect(res).to.be.json
				expect(res).to.have.status(200)
				expect(res.body).to.have.length(2)
				done()
			})
		});
	});
});






