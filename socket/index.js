import { handleChatSocket } from './handlers/chatHandler.js';
import { handleMessageSocket } from './handlers/messageHandler.js';
import { handleUserSocket } from './handlers/userHandler.js';
import { SOCKET_EVENTS } from './socketEvents.js';

export default function initSocket(io) {
    io.on('connection', (socket) => {

        // Modular handlers
        handleUserSocket(io, socket);
        handleChatSocket(io, socket);
        handleMessageSocket(io, socket);

        // Join chat room
        // socket.on(SOCKET_EVENTS.JOIN_CHAT, (chatId) => {
        //     socket.join(chatId);
        //     console.log(`Socket ${socket.id} joined room ${chatId}`);
        // });

        socket.on(SOCKET_EVENTS.USER.DISCONNECTED, () => {
            console.log('Socket disconnected:', socket.id);
        });
    });
}
