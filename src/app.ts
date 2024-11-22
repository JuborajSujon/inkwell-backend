// const express = require('express')
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { ProductRoutes } from './app/module/product/product.route';
import { errorHandler } from './app/module/errorHandler/errorHandler';

const app: Application = express();

//parser
app.use(express.json());
app.use(cors());

//application routes
app.use('/api/products', ProductRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Home Page');
});

app.use(errorHandler);

export default app;
