const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { incomingRequestLogger } = require('./middleware/index.js');
const indexRouter = require('./routes/index.js');
dotenv.config();

const userRouter = require('./routes/user');
const taskRouter = require('./routes/task');

const app = express();

app.use(incomingRequestLogger);

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/v1', indexRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/task', taskRouter);

app.listen(process.env.PORT, () => {
  console.log('Server is running on port 3001');
  mongoose.connect(process.env.MONGOOSE_URI_STRING, {});
  mongoose.connection.on('error', (err) => {
    console.log(err);
  });
});
