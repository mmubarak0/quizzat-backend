const express = require('express');
const app = express();
const cors = require('cors');
const authRouter = require('./v1/routes/auth.routes');
const userRouter = require('./v1/routes/user.routes');
const db = require('./utils/db');

// configure json response on this server.
app.use(express.json());
app.use(cors());

// application routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);

// test route to check if the server is running
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to the API', statusCode: 200 });
});

app.get('/api/v1/test', (req, res) => {
  res.status(200).json({ message: 'API is working: built nodejs v20', statusCode: 200 });
});

// 404 error handler
app.use((req, res) => {
  res.status(404).json({ message: 'This endpoint has not been impelemented yet', statusCode: 404 });
});

module.exports = app;
