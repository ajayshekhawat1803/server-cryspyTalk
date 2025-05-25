import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { corsConfig } from './config/corsConfig.js';
import authRouter from './routers/authRouter.js';
import authMiddleware from './middlewares/authMiddleware.js';
import userRouter from './routers/userRouter.js';
import friendshipRouter from './routers/friendshipRouter.js';
import chatsRouter from './routers/chatsRouter.js';
import msgRouter from './routers/messageRouter.js';
dotenv.config();

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
app.use('/public', express.static('public'));
app.use(express.json());


// Binding Routers
app.use('/auth', authRouter);
app.use('/user', authMiddleware, userRouter);
app.use('/friendship', authMiddleware, friendshipRouter);
app.use('/chats', authMiddleware, chatsRouter);
app.use('/messages', authMiddleware, msgRouter);



// For status check
app.get('/', (req, res) => {
    res.send('Server is running!');
});

// Starting the server
app.listen(port, () => {
    console.log(`Server is listening request on port ${port}`);
});