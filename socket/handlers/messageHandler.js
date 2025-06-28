import { SOCKET_EVENTS } from '../socketEvents.js';

export function handleMessageSocket(io, socket) {
  socket.on(SOCKET_EVENTS.SEND_MESSAGE, (messageData) => {
    const { chatId, sender, text, media } = messageData;

    // Broadcast to chat room
    io.to(chatId).emit(SOCKET_EVENTS.RECEIVE_MESSAGE, {
      sender,
      text,
      media,
      timestamp: new Date(),
    });
  });
}
