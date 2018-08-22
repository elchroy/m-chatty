import express from 'express';
import db from '../models';
import path from 'path';
import bodyParser from 'body-parser';

import { verifyAuth } from '../middlewares';
import { prepareFirstChat } from '../helpers';
import { authRouter, userRouter, messageRouter, chatRouter } from '../routers'

const app = express();

app.use(express.static("public"))// for our frontend assets.

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json());

app.get("/", (req, res, next) => {
	// https://stackoverflow.com/questions/26079611/node-js-typeerror-path-must-be-absolute-or-specify-root-to-res-sendfile-failed
	res.sendFile('/public/index.html', { root: '.' });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/chats", chatRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/messages", verifyAuth, messageRouter);

app.use((err, req, res, next) => {
	// if (req.app.get('env') === 'production') delete err.stack;
	res.status(err.errorCode || 500).json(err)
});

app.set("views", path.join(__dirname, "../public/views"));
app.set("view engine", "pug");

db.sequelize.sync();

prepareFirstChat(db);

export default app;