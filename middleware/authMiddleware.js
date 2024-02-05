const jwt = require('jsonwebtoken');
const User = require('../models/userModel.js');

const protect = async (req, res, next) => {
  try {
    const token =
      req.cookies.accessToken ||
      req.header('Authorization').replace('Bearer ', '');

    if (!token) {
      throw new Error('Unauthorized request');
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken._id).select('-password');
    if (!user) {
      throw new Error('No User. Invalid Access Token');
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Server Error' });
    console.log(error);
  }
};

module.exports = { protect };
