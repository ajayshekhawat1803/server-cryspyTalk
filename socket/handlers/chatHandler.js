import messagesModel from '../../models/message.js';
import userModel from '../../models/user.js';

import { SOCKET_EVENTS } from '../socketEvents.js';

export function handleChatSocket(io, socket) {
    socket.on(SOCKET_EVENTS.CHAT.JOIN, (data) => {
        socket.join(data.chatId);
        console.log(`Socket ${socket.id}: ${data.msg}`);
    });

    socket.on(SOCKET_EVENTS.CHAT.TYPING, ({ chatId }) => {
        socket.to(chatId).emit(SOCKET_EVENTS.CHAT.TYPING, { chatId });
    });

    socket.on(SOCKET_EVENTS.CHAT.STOP_TYPING, ({ chatId }) => {
        socket.to(chatId).emit(SOCKET_EVENTS.CHAT.STOP_TYPING, { chatId });
    });


    socket.on(SOCKET_EVENTS.CHAT.SEEN, async ({ chatId, userId }) => {
        try {
            await messagesModel.updateMany(
                { chatId, seenBy: { $ne: userId } },
                { $addToSet: { seenBy: userId } }
            );
            const userDetails = await userModel.findById(userId, 'firstName profilePic');
            socket.to(chatId).emit(SOCKET_EVENTS.CHAT.UPDATE_SEEN, { chatId, userId, firstName: userDetails.firstName, profilePic: userDetails.profilePic });
        } catch (err) {
            console.error('Error updating seen:', err);
        }
    });


}
