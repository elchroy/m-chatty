import db from '../models'
const { User, Chat, UserChat } = db;

export const createChat = (req, res) => {
	const { authUser } = req

	Chat.create({
		UserId: authUser.id, // the owner of the chat/channel
	}).then(chat => {
		return chat.addUser(authUser).then(() => {
			res.status(201).json({
				message: "success",
				chat
			});
		});
	});
}

/**
 * Get all the chats that this user has subscribed to, like all the rooms
 */
export const getAllUserChats = (req, res) => {
	const { authUser } = req // destructuring

	authUser.getChats({
		attributes: ['id', 'name']
	}).then(chats => {
		res.send(chats)
	});
}

export const getOneUserChat = (req, res) => {
	const { authUser:{ id }, params:{ chatId } } = req // destructuring
	Chat.findOne({
		where: {
			id: chatId,
			UserId: id
		}
	}).then(chat => {
		res.status(200).json({
			message: "success",
			chat
		})
	})
}

/**
 * Join a given chat
 */
export const joinChat = (req, res) => {
	const { authUser, params:{ chatId }, chat } = req // destructuring
	return chat.hasUser(authUser).then((chathasUser) => {
		if(!chathasUser) {
			return chat.addUser(authUser).then(() => {
				res.status(200).json({
					message: "Successfully joined chat.",
					chat
				})
			})
		} else {
			res.status(200).json({
				message: "Already in chat.",
				chat
			})
		}
	})
}

// export const leaveChat = (req, res) => {
// 	const { authUser, params:{ chatId }, chat } = req
// 	return chat.hasUser(authUser).then((chathasUser) => {
// 		if(!chathasUser) {
// 			res.status(200).json({
// 				message: "Not in chat.",
// 				chat
// 			})
// 		} else {
// 			return chat.removeUser(authUser).then(() => {
// 				res.status(200).json({
// 					message: "Successfully joined chat.",
// 					chat
// 				})
// 			})
// 		}
// 	})
// }

/**
 * Add a given User to a particular chat
 */
export const addMember = (req, res) => {
	// console.log(req)
	res.send('hisdhfogsildxjfhg sj');
}