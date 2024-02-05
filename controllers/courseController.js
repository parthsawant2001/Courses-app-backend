const Course = require('../models/courseModel.js');
const jwt = require('jsonwebtoken');

const createCourse = async (req, res) => {
  const { image, title, description } = req.body;
  if (!image || !title || !description) {
    return res.status(400).json({ message: 'Please fill all the fields' });
  }

  const courseExists = await Course.findOne({ title });

  if (courseExists) {
    return res.status(409).json({ message: 'Course title already taken.' });
  }

  const course = await Course.create({
    image,
    title,
    description,
    instructor: req.user._id,
  });

  const createdCourse = await Course.findById(course._id);

  if (!createdCourse) {
    return res
      .status(500)
      .json({ message: 'Something went wrong while creating user' });
  }

  return res
    .status(200)
    .json({ message: 'course created successfully', course: createdCourse });
};

const allCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate('instructor');

    if (!courses) {
      return res.json({ message: 'Error fetching courses' });
    }

    return res.json({ message: 'All courses', courses });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server Error' });
  }
};

const getCourse = async (req, res) => {
  const { id } = req.params;
  const course = await Course.findById(id).populate('instructor');

  if (!course) {
    return res.status(404).json({ message: 'Course not found' });
  }

  return res.status(200).json(course);
};

const updateCourse = async (req, res) => {
  const courseExists = await Course.findById(req.params.id);

  if (!courseExists) {
    return res.status(404).json({ message: 'Course does not exist' });
  }

  if (req.user.id !== courseExists.instructor.toString()) {
    return res.json({
      message: 'You are not the owner of the course. You cannot edit it.',
    });
  }

  const course = await Course.findByIdAndUpdate(req.params.id, req.body);
  return res.status(200).json({ message: 'Course Edited successfully' });
};

const deleteCourse = async (req, res) => {
  const courseExists = await Course.findById(req.params.id);

  if (!courseExists) {
    return res.json({ message: 'Course does not exist' });
  }
  // console.log(req.user.id, courseExists.instructor);

  if (req.user.id !== courseExists.instructor.toString()) {
    return res.json({ message: 'You are not the owner of the course' });
  }

  const course = await Course.findByIdAndDelete(req.params.id);
  return res.status(200).json({ message: 'Course deleted successfully' });
};

module.exports = {
  allCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
};
