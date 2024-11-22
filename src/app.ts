// const express = require('express')
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import productRoute from './app/module/product/product.route';

const app: Application = express();

//parser
app.use(express.json());
app.use(cors());

//application routes
app.use('/api/products', productRoute);

app.get('/', (req: Request, res: Response) => {
  res.send('Home Page');
});

export default app;
