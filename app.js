import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { corsConfig } from './config/corsConfig.js';
import authRouter from './routers/auth-router.js';
import authMiddleware from './middlewares/authMiddleware.js';
import userRouter from './routers/user-router.js';
import friendshipRouter from './routers/friendship-router.js';
import chatsRouter from './routers/chats-router.js';
import msgRouter from './routers/message-router.js';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { setIO } from './socket/socketService.js';
import initSocket from './socket/index.js';
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
const server = createServer(app);

// Socket.io setup
const io = new Server(server, {
    cors: corsConfig,
});
setIO(io);
initSocket(io);

app.use(cors(corsConfig));
app.use('/public', express.static('public'));
app.use('/uploads', express.static('uploads'));
app.use(express.json());


// Binding Routers
app.use('/auth', authRouter);
app.use('/user', authMiddleware, userRouter);
app.use('/friendship', authMiddleware, friendshipRouter);
app.use('/chats', authMiddleware, chatsRouter);
app.use('/messages', authMiddleware, msgRouter);

app.get('/uploads/:folder/:filename', authMiddleware, (req, res) => {
    const { folder, filename } = req.params;

    // Sanitize folder and filename
    const safeFolder = folder.replace(/[^a-zA-Z0-9_-]/g, '');
    const safeFilename = filename.replace(/[^a-zA-Z0-9._-]/g, '');

    const filePath = path.join('uploads', safeFolder, safeFilename);

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ success: false, message: 'File not found' });
    }

    res.sendFile(path.resolve(filePath));
});



// For status check
app.get('/', (req, res) => {
    res.send('Server is running!');
});
app.get('/health', (req, res) => {
    res.send(`Server is running perfectly on port ${port}!`);
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('🔥 Error:', err || err);

    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
    });
});

server.listen(port, () => {
    console.log(`Server is listening request on port ${port}`);
});