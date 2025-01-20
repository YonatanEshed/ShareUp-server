import bodyParser from 'body-parser';
import express from 'express';

import './config/firebase'; // Ensure FireORM is initialized

import routerAuth from './features/users/routes/auth.routes';

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/auth', routerAuth);
// app.use('/users', userRoutes);
// app.use('/posts', postRoutes);
// app.use('/chat', chatRoutes);

export default app;
