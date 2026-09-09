import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { verifyAccessToken } from './utils/jwt';
import prisma from './utils/prisma';

let io: Server;

export const initSocket = (server: HttpServer) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      methods: ['GET', 'POST']
    }
  });

  // 🔐 Authenticate every socket connection via JWT
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(' ')[1];
    if (!token) {
      return next(new Error('Authentication required'));
    }
    try {
      const payload = verifyAccessToken(token);
      (socket as any).user = payload;
      next();
    } catch {
      next(new Error('Invalid or expired token'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const user = (socket as any).user;
    console.log(`Socket connected: ${socket.id} (user: ${user?.userId})`);

    // 🔐 Verify room membership before joining
    socket.on('join_room', async (roomId: string) => {
      try {
        const member = await prisma.chatMember.findFirst({
          where: { roomId, userId: user.userId }
        });
        if (!member && !user.isSuperAdmin) {
          socket.emit('error', { message: 'You are not a member of this room' });
          return;
        }
        socket.join(roomId);
      } catch (err) {
        console.error('join_room error:', err);
      }
    });

    // Leave a specific chat room
    socket.on('leave_room', (roomId: string) => {
      socket.leave(roomId);
    });

    // Typing indicators — only emit to rooms the socket is actually in
    socket.on('typing_start', ({ roomId, userName }: { roomId: string, userName: string }) => {
      if (socket.rooms.has(roomId)) {
        socket.to(roomId).emit('typing_start', { userName });
      }
    });

    socket.on('typing_stop', ({ roomId, userName }: { roomId: string, userName: string }) => {
      if (socket.rooms.has(roomId)) {
        socket.to(roomId).emit('typing_stop', { userName });
      }
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

