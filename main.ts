import express, { Express } from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth';
import messageRoutes from './routes/messages';
import usersRoutes from './routes/users';
import connectToMongoDb from './db';
import { app, server } from './socket';
dotenv.config();

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/users', usersRoutes);

server.listen(process.env.PORT, () => connectToMongoDb());
