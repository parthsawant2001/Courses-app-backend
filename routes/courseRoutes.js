const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  allCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
} = require('../controllers/courseController');

router.route('/').get(allCourses);
router.route('/:id').get(protect, getCourse);
router.route('/create').post(protect, createCourse);
router.route('/update/:id').put(protect, updateCourse);
router.route('/delete/:id').delete(protect, deleteCourse);

module.exports = router;
