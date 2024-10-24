const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const fs = require('fs');

const app = express();

app.use((req, res, next) => {
  fs.appendFileSync(
    'log.txt',
    req.method + ' ' + req.url + new Date().toISOString() + '\n'
  );
  next();
});

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(process.env.PORT, () => {
  console.log('Server is running on port 3000');
});
