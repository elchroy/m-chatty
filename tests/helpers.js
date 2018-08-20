import db from '../models';
import 'babel-polyfill';

export const truncateDB = async () => {
	return await Promise.all(
		Object.keys(db).map((modelName) => {
			if (['sequelize', 'Sequelize'].includes(modelName)) return null;
			return db[modelName].destroy({
				where: {},
				force: true
			})
		})
	)
}