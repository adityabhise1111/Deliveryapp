import express,  { Application, Request, Response } from 'express'
import dotenv from 'dotenv'
import { connectToDB } from './db/db.js';
import cors from 'cors';
import userRoutes from './routes/user.route';
import cookieParser from 'cookie-parser';
dotenv.config();
connectToDB()

const app : Application = express()

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use('/users', userRoutes);

app.get('/' , (req:Request,res:Response)=> {
    res.send("hellow");
})


export default app;