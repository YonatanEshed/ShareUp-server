import express from 'express';

const app = express();
const port = process.env.PORT;

app.use(express.json());

app.listen(port, () => {
    console.log(`server is running at http://localhost:${port}`);
});
