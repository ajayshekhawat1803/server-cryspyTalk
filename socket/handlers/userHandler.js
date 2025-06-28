import { SOCKET_EVENTS } from '../socketEvents.js';

export function handleUserSocket(io, socket) {
  socket.on(SOCKET_EVENTS.USER_TYPING, (chatId) => {
    socket.to(chatId).emit(SOCKET_EVENTS.USER_TYPING);
  });

  socket.on(SOCKET_EVENTS.STOP_TYPING, (chatId) => {
    socket.to(chatId).emit(SOCKET_EVENTS.STOP_TYPING);
  });
}
