import express from 'express';
import app from './app';
import config from '@/config/env';

const main = express();
main.use('/api', app);

const port = config.port;

main.listen(port, () => {
    console.log(`server is running at http://localhost:${port}`);
});
