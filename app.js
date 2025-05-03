import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { corsConfig } from './config/corsConfig.js';
import authRouter from './routers/authRouter.js';
import authMiddleware from './middlewares/authMiddleware.js';
import userRouter from './routers/userRouter.js';
dotenv.config();

console.log('------', process.env.DB_URL);
const port = process.env.PORT || 5000;
const db = process.env.DB_URL || 'mongodb://localhost:27017/Cryspy-Talk';

// Database connection
mongoose.connect(db, {
})
    .then(() => {
        console.log('Database connected successfully!');
    })
const app = express();
app.use(cors(corsConfig));
app.use(express.json());


// Binding Routers
app.use('/auth', authRouter);
app.use('/user', authMiddleware, userRouter);



// For status check
app.get('/', (req, res) => {
    res.send('Server is running!');
});

// Starting the server
app.listen(port, () => {
    console.log(`Server is listening request on port ${port}`);
});