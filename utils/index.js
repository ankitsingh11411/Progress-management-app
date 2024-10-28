const dotenv = require('dotenv');
dotenv.config();
const jwt = require('jsonwebtoken');

const isAuth = (req) => {
  const token = req.headers.authorization;
  if (!token) {
    return null;
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.id;
  } catch (error) {
    return null;
  }
};

module.exports = isAuth;
