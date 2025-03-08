import express from 'express';
import app from './app';
// import config from '@/config/env';
import * as functions from 'firebase-functions';

const main = express();
main.use('/api', app);

// Commented out the local server code since we are using Firebase functions
// const port = config.port;
// main.listen(port, () => {
//     console.log(`server is running at http://localhost:${port}`);
// });

export const api = functions.https.onRequest(app);
