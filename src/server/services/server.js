import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { config } from 'dotenv';
import { connectDB, disconnectDB } from '../config/db.js';
//import routes
import authRoutes from '../routes/authRoutes.js';
import workplaceRoutes from '../routes/workplaceRoutes.js';
import jobResearchRoutes from '../routes/jobResearchRoutes.js';
config();
connectDB();

const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/auth', authRoutes);
app.use('/workplace', workplaceRoutes);
app.use('/jobs', jobResearchRoutes);
// Middleware to parse JSON requests
// Start the server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});

//body

//error handling
process.on('unhandledRejection', (err) => {
  console.log(`Unhandled Rejection: ${err.message}`);
  server.close(async () => {
    await disconnectDB();
    process.exit(1);
  });
});
process.on('uncaughtException', (err) => {
  console.log(`Uncaught Exception: ${err.message}`);
  server.close(async () => {
    await disconnectDB();
    process.exit(1);
  });
});
process.on('SIGTERM', (err) => {
  console.log(`SIGTERM recieved, shutying down gracefully: ${err.message}`);
  server.close(async () => {
    await disconnectDB();
    process.exit(0);
  });
});
