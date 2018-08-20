import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import 'babel-polyfill';
import { truncateDB } from './helpers';
import db from '../models'
import { createPasswordHash } from '../helpers'
import app from '../src/app'

chai.use(chaiHttp)

describe('Authentication', () => {

	let user;
	let endpoint;

	before(async () => {
		await truncateDB();
	});

	describe('SignIn', () => {
		
		let user;
		let userData = {
			username: 'footest',
			password: 'bartest'
		};

		before(async () => {
			user = await db.User.create({
				username: userData.username,
				password: createPasswordHash(userData.password)
			});
			endpoint = `/api/v1/auth/signin`;
		});

		after(async () => {
			await db.User.destroy({
				where: {}
			})
		});

		beforeEach(async () => {
		});

		const signInWith = (userSignInData) => {
			return chai.request(app)
				.post(endpoint)
				.send(userSignInData)
		}

		it('should not authenticate a user with invalid signin credentials', done => {
			const invalidUserData = {
				username: 'invalidUserName',
				password: 'invalidPassword'
			}
			signInWith(invalidUserData).end((err, res) => {
				expect(res).to.be.json
				expect(res).to.have.status(400);
				expect(res.body).not.to.have.property('token');
				expect(res.body.message).to.equal('Signin not successful. Invalid username/password.');
				done()
			})
		});

		it('should successfully authenticate an existing user', done => {
			signInWith(userData).end((err, res) => {
				expect(res).to.be.json
				expect(res).to.have.status(200);
				expect(res.body.message).to.equal('Signin successful');
				expect(res.body).to.have.property('token');
				done();
			})
		});
	});

	describe.only('SignUp', () => {

		before(() => {
			endpoint = `/api/v1/auth/signup`;
			user = {
				username: "johndoe",
				password: "johndoe123"
			}
		})

		beforeEach(() => {
		});

		const signUpWith = (userSignUpData) => {
			return chai.request(app)
				.post(endpoint)
				.send(userSignUpData)
		}

		it('should not create a new user when username or password is not present', done => {
			const invalidUser = {};

			signUpWith(invalidUser).end((err, res) => {
				expect(res).to.be.json
				expect(res).to.have.status(400);
				expect(res.body.message).to.equal('Username/Password are required')
				done();
			})
		});

		it('should not create a new user when username/password is empty', done => {
			const emptyDetails = { username: '', password: '' };

			signUpWith(emptyDetails).end((err, res) => {
				expect(res).to.be.json
				expect(res).to.have.status(400);
				expect(res.body.message).to.equal('Username/Password are required')
				done();
			})
		});

		it('should successfully create a new user', done => {
			db.User.count().then(count => expect(count).to.equal(0))
			signUpWith(user).end((err, res) => {
				expect(res).to.be.json
				expect(res).to.have.status(201);
				expect(res.body.username).to.equal('johndoe');
				expect(res.body.token).to.not.equal('');
				db.User.count().then(count => expect(count).to.equal(1))
				done()
			});
		});
	});
});