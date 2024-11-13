import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { connectDatabase } from './config/database.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

const app = express();

app.use(express.json({ limit: '10mb' })); // Increase JSON payload limit
app.use(express.urlencoded({ limit: '10mb', extended: true })); // Increase URL-encoded payload limit

// CORS configuration
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'], // Your frontend URLs
    credentials: true, // Important for cookies
  })
);

// Add these middleware before routes
app.use(express.json());
app.use(cookieParser());

// Database connection
connectDatabase();

// Routes
app.use('/api', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}.`);
});