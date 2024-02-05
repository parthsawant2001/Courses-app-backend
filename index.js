const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const courseRoutes = require('./routes/courseRoutes');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');

const app = express();

app.use(cors({ origin: 'http://localhost:3001', credentials: true }));
app.use(express.json());
app.use(cookieParser());
dotenv.config();
connectDB();

app.use('/api/user', userRoutes);
app.use('/api/course', courseRoutes);

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, console.log(`Server running on PORT:${PORT}`));
