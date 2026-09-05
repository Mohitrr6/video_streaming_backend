import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import './config/db.js'
import './config/redis.js'

import cookieParser from "cookie-parser";
import cors from 'cors';


import authRouter from './routers/authRoutes.js'
import mediaRouter from './routers/mediaRoutes.js'



const app = express();
app.use(cors({
     origin: ["http://localhost:5173","https://video-streaming-frontend-1.onrender.com"], // Your frontend URL
    credentials: true,               // Allow cookies
}));
app.use(express.json());
app.use(express.urlencoded({'extended': true}));
app.use(cookieParser());
app.get('/',(req,res)=>{
    res.status(200).json("test");
})
app.get("/respond",(req,res)=>{
    res.status(200).json("working");
})
app.use('/api/auth',authRouter);
app.use('/api/media',mediaRouter);
app.listen(process.env.PORT,async()=>{
    
    console.log(`Server is runnning at ${process.env.PORT}`);
})