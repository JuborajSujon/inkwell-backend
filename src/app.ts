// const express = require('express')
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { errorHandler } from './app/module/errorHandler/errorHandler';
import router from './app/routers';

const app: Application = express();

//parser
app.use(express.json());
app.use(cors());

//application routes
app.use('/api', router);

app.get('/', (req: Request, res: Response) => {
  res.send('Home Page');
});

app.use(errorHandler);

export default app;
