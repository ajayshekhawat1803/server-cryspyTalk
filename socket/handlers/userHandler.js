import { SOCKET_EVENTS } from '../socketEvents.js';

export function handleUserSocket(io, socket) {
  socket.on(SOCKET_EVENTS.USER_TYPING, (chatId) => {
    socket.to(chatId).emit(SOCKET_EVENTS.USER_TYPING);
  });

  socket.on(SOCKET_EVENTS.STOP_TYPING, (chatId) => {
    socket.to(chatId).emit(SOCKET_EVENTS.STOP_TYPING);
  });

  socket.on(SOCKET_EVENTS.USER.CONNECTED, ({ userId }) => {
    socket.join(userId);
    console.log(`User ${userId} joined personal room ${userId}`);
  });


  socket.on(SOCKET_EVENTS.FRIEND.REQUEST_RECEIVED, ({ senderId, receiverId }) => {
    console.log('event received: ', SOCKET_EVENTS.FRIEND.REQUEST_RECEIVED, 'from:', senderId, 'to:', receiverId);

    socket.to(receiverId).emit(SOCKET_EVENTS.FRIEND.REQUEST_RECEIVED, {
      senderId,
      receiverId,
    });
  });
}
