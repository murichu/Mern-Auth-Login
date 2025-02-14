import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from "./config/mongoDb.js";
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';


// Load environment variables
dotenv.config();

// Initialize express
const app = express();

// Database Connection
connectDB();

// Middleware to parse JSON requests
app.use(express.json());


//middleware
app.use(cors({ 
  origin: process.env.CLIENT_URL,  
  credentials: true }));
app.use(express.json());
app.use(cookieParser());


// Routes
app.get('/', (req, res) => {
  res.send('API is working!');
});

// API Endpoints
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);


// Set the port
const PORT = process.env.PORT;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});