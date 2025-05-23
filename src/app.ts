import express from 'express';
import cors from 'cors';
import { fileParser } from 'express-multipart-file-parser';

import './config/firebase'; // Ensure FireORM is initialized

import routerAuth from './features/users/routes/auth.routes';
import routerProfile from './features/users/routes/profile.routes';
import routerPost from './features/posts/routes/posts.routes';
import routerActivity from './features/notifications/routes/activity.routes';
import { authenticate } from './features/users/middlewares/authenticate.middleware';
import { fileUpload } from './shared/middlewares/multipart.middleware';
import { searchUsers } from './features/users/controllers/search.controller';

const app = express();

// Middleware
app.use(
    fileParser({
        rawBodyOptions: {
            limit: '10mb', // Adjust the limit as needed
        },
    })
);
app.use(fileUpload);
app.use(cors({ origin: true }));

// Routes
app.use('/auth', routerAuth);
app.use('/profile', authenticate, routerProfile);
app.use('/posts', authenticate, routerPost);
app.use('/search', authenticate, searchUsers);
app.use('/notifications', authenticate, routerActivity);

export default app;
