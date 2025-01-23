import express from 'express';

import './config/firebase'; // Ensure FireORM is initialized

import routerAuth from './features/users/routes/auth.routes';
import routerProfile from './features/users/routes/profile.routes';
import { authenticate } from './features/users/middlewares/authenticate.middleware';

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/auth', routerAuth);
app.use('/profile', authenticate, routerProfile);
// app.use('/posts', postRoutes);
// app.use('/chat', chatRoutes);

export default app;
