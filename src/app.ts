// const express = require('express')
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from './app/routers';
import { globalErrorHandler } from './app/middlwares/globalErrorHandler';

const app: Application = express();

//parser
app.use(express.json());
app.use(cors());
app.use(cookieParser());

//application routes
app.use('/api', router);

app.get('/', (req: Request, res: Response) => {
  res.send('Home Page');
});

app.use(globalErrorHandler);

export default app;
