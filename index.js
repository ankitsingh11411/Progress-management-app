const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { incomingRequestLogger } = require('./middleware/index.js');
const indexRouter = require('./routes/index.js');
dotenv.config();
const fs = require('fs');
const userRouter = require('./routes/user.js');

const app = express();

app.use(incomingRequestLogger);

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/v1', indexRouter);
app.use('/api/v1/user', userRouter);

app.listen(process.env.PORT, () => {
  console.log('Server is running on port 3000');
  mongoose.connect(process.env.MONGOOSE_URI_STRING, {});
  mongoose.connection.on('error', (err) => {
    console.log(err);
  });
});
