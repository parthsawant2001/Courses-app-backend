const User = require('../models/userModel.js');
const Course = require('../models/courseModel.js');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please fill all the fields' });
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(409).json({ message: 'User already exists.' });
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  const accessToken = await user.generateToken();

  const createdUser = await User.findById(user._id).select('-password');

  if (!createdUser) {
    res
      .status(500)
      .json({ message: 'Something went wrong while creating user' });
    return;
  }

  const options = {
    httpOnly: true,
  };

  return res
    .status(200)
    .cookie('accessToken', accessToken, options)
    .json({ message: 'User created successfully', user: createdUser });
};

const authUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email && !password) {
    return res.status(400).json({ message: 'Please fill all the fields' });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(409).json({ message: 'User does not exists.' });
  }

  const checkPassword = await user.matchPassword(password);

  if (!checkPassword) {
    return res.status(401).json({ message: 'Invalid password' });
  }

  const accessToken = await user.generateToken();

  const loggedInUser = await User.findById(user._id).select('-password');

  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie('accessToken', accessToken, options)
    .json({ message: 'Login successfull', user: loggedInUser });
};

const logoutUser = async (req, res) => {
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie('accessToken', options)
    .json('User logged Out');
};

const getUser = async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(404);
  }
  return res.status(200).json({ message: 'User fetched successfully', user });
};

const buyCourse = async (req, res) => {
  const courseExists = await Course.findById(req.params.id);

  if (!courseExists) {
    return res.status(404).json({ message: 'Course does not exist' });
  }

  const courseBought = await User.findByIdAndUpdate(req.user.id, {
    $addToSet: {
      myLearning: courseExists,
    },
  });

  return res
    .status(200)
    .json({ message: 'Course purchase successfull.', course: courseBought });
};

const myLearning = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'myLearning',
      populate: { path: 'instructor' },
    });

    return res.json({ message: 'My Learning', user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server Error' });
  }
};
module.exports = {
  registerUser,
  authUser,
  logoutUser,
  getUser,
  buyCourse,
  myLearning,
};
