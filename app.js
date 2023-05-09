// app.js
const express = require('express');
const cors = require('cors');
const usersRouter = require('./routes/usersRouter');
const postsRouter = require('./routes/postsRouter');
const commentsRouter = require('./routes/commentsRouter');
const likesRouter = require('./routes/likesRouter');
const postImagesRouter = require('./routes/postImagesRouter');
const tagsRouter = require('./routes/tagsRouter');
const postTagsRouter = require('./routes/postTagsRouter');
const messagesRouter = require('./routes/messagesRouter');
const notificationsRouter = require('./routes/notificationsRouter');
const followersRouter = require('./routes/followersRouter');
const loginRouter = require('./routes/loginRouter');

const app = express();
app.use(cors());

app.use(express.json());
app.use('/users', usersRouter);
app.use('/posts', postsRouter);
app.use('/comments', commentsRouter);
app.use('/likes', likesRouter);
app.use('/post-images', postImagesRouter);
app.use('/tags', tagsRouter);
app.use('/post-tags', postTagsRouter);
app.use('/messages', messagesRouter);
app.use('/notifications', notificationsRouter);
app.use('/followers', followersRouter);
app.use('/login', loginRouter);

module.exports = app;
