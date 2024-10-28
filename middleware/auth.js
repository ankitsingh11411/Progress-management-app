const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const authmiddleware = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'User needs to be logged in' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'INVALID TOKEN' });
  }
};

module.exports = authmiddleware;
