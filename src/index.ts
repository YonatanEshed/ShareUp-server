import express from 'express';
import app from './app';
// import config from '@/config/env';
import * as functions from 'firebase-functions';

const main = express();
main.use('/api', app);

// const port = 3000;
// main.listen(port, () => {
//     console.log(`server is running at http://localhost:${port}`);
// });

export const api = functions.https.onRequest({ region: 'europe-west1' }, app);
