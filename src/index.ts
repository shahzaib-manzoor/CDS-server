import 'dotenv/config';
import { MongoClient } from "mongodb";
import baseRouter from "./routes";
import connectDB from './config/db.confog';


import express from 'express';
import cors from 'cors';
connectDB();

import errorHandler from "./middlewares/error-handler";
import auth_middleware from "./middlewares/auth-middleware";
import loggerMiddleware from './middlewares/logger-middleware';

const app = express();
 

app.use(express.json());
app.use(cors({ origin: '*' }));
app.use(loggerMiddleware)
// app.use(auth_middleware);
app.use(express.urlencoded({ extended: true }));
 
app.use('/api', baseRouter);
app.use(errorHandler);


app.listen(process.env.PORT, () => {
  return console.log(`Express is listening at http://localhost:${process.env.PORT}`);
});