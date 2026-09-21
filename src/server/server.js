import express from 'express';
import {config } from 'dotenv';
import {connectDB , disconnectDB} from './config/db.js';
//import routes 
import todosRouter from './routes/todosRoute.js';
import authRouter from './routes/authRoutes.js';
config()
connectDB()

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRouter);
app.use("/todos", todosRouter);

// Middleware to parse JSON requests

app.get("/auth/signup",(req , res)=>{
  res.json({message : "hello world"})
})
// Start the server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});

//body















//error handling 
process.on('unhandledRejection', (err) => {
  console.log(`Unhandled Rejection: ${err.message}`);
  server.close(async () =>{
    await disconnectDB();
    process.exit(1)
  }
);})
process.on('uncaughtException', (err) => {
  console.log(`Uncaught Exception: ${err.message}`);
  server.close(async () =>{
    await disconnectDB();
    process.exit(1)
  }
);})
process.on('SIGTERM', (err) => {
  console.log(`SIGTERM recieved, shutying down gracefully: ${err.message}`);
  server.close(async () =>{
    await disconnectDB();
    process.exit(0)
  }
);})
