import express,  { Application, Request, Response } from 'express'
import dotenv from 'dotenv'
import { connectToDB } from './db/db.js';
import cors from 'cors';
import userRoutes from './routes/user.route';
import captainRoutes from './routes/captain.routes';
import mapRoutes from './routes/maps.routes';
import ridesRoutes from './routes/ride.routes';
import cookieParser from 'cookie-parser';
// Import models to ensure they are registered
import './model/user.model';
import './model/captain.model';
import './model/ride.model';


dotenv.config();
connectToDB();

const app : Application = express()

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use('/users', userRoutes);
app.use('/captains', captainRoutes);


app.use('/maps', mapRoutes);   
app.use('/rides',ridesRoutes); 

app.get('/' , (req:Request,res:Response)=> {
    res.send("hellow");
})


export default app;