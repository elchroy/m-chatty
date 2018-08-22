import db from '../models'
const { User } = db;

export const getAll = (req, res) => {
	User.findAll({}).then(users => {
		const filteredUsers = users.map(user => {
			return {
				id: user.id,
				username: user.username,
				dateJoined: user.updatedAt
			}
		})
		res.status(200).json(filteredUsers)
	}).catch();
}