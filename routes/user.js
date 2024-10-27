const express = require('express');
const router = express.Router();
const { User } = require('../schema/user.schema');
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');

router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  console.log(name, email, password);
  const ifUserExists = await User.findOne({ email: email });
  if (ifUserExists) {
    return res.status(409).json({ message: 'User already exists' });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    name,
    email,
    password: hashedPassword,
  });
  await user.save();
  res.status(201).json({ message: 'User created successfully' });
});

module.exports = router;
