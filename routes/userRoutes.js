const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  registerUser,
  authUser,
  logoutUser,
  getUser,
  buyCourse,
  myLearning,
} = require('../controllers/userController');

router.route('/').post(registerUser);
router.route('/').get(protect, getUser);
router.route('/mylearning').get(protect, myLearning);
router.route('/logout').post(protect, logoutUser);
router.post('/login', authUser);
router.route('/buy/:id').put(protect, buyCourse);

module.exports = router;
