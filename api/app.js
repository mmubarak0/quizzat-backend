const express = require('express');
const app = express();
const cors = require('cors');
const authRouter = require('./v1/routes/auth.routes');

// configure json response on this server.
app.use(express.json());
app.use(cors());

// application routes
app.use('/api/v1/auth', authRouter);

// 404 error handler
app.use((req, res) => {
  res.status(404).json({ message: 'This endpoint has not been impelemented yet', statusCode: 404 });
});

module.exports = app;
