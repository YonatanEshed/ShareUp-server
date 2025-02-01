import express from 'express';
import cors from 'cors';

import './config/firebase'; // Ensure FireORM is initialized

import routerAuth from './features/users/routes/auth.routes';
import routerProfile from './features/users/routes/profile.routes';
import routerPost from './features/posts/routes/posts.routes';
import { authenticate } from './features/users/middlewares/authenticate.middleware';

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/auth', routerAuth);
app.use('/profile', authenticate, routerProfile);
app.use('/posts', authenticate, routerPost);
// app.use('/chat', authenticate, chatRoutes);

export default app;
