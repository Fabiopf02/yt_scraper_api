import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import './config/mongoose/connection';
import { routes } from './routes';

const app = express();

app.use(cors({ exposedHeaders: 'X-Total-Count' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(routes);

export { app };
