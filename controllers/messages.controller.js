import db from '../models'
const { Message, User } = db;

// first ensure that the chat id is valid and it exists.
export const createChatMessage = (req, res) => {
	const { authUser:{id}, chat, body:{body} } = req // destructuring
	// @todo consider using chat.addMessage to do this.
	Message.create({
		from: id,
		to: chat.id,
		body
	}).then(message => {
		res.status(201).json(message)
	});

}

// first ensure that the chat id is valid and it exists.
export const getAllChatMessages = (req, res) => {
	const { chat } = req // destructuring
	
	chat.getMessages().then(messages => {
		messages.map(m => m.sender().then(chat => console.log(chat.name)))
		res.status(200).json(messages)
	});
}