import { Server } from "socket.io";
import type { Server as HttpServer } from "http";
import { storage } from "./storage";

interface SocketUser {
  id: string;
  socketId: string;
}

const connectedUsers = new Map<string, SocketUser>();
const userSockets = new Map<string, string>();

export function setupSocketIO(httpServer: HttpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Handle user authentication
    socket.on("authenticate", async (userId: string) => {
      if (userId) {
        connectedUsers.set(socket.id, { id: userId, socketId: socket.id });
        userSockets.set(userId, socket.id);
        
        // Update user online status
        await storage.updateUserOnlineStatus(userId, true);
        
        // Join user to their personal room
        socket.join(`user:${userId}`);
        
        // Notify friends that user is online
        const friends = await storage.getFriends(userId);
        friends.forEach(friend => {
          const friendSocketId = userSockets.get(friend.id);
          if (friendSocketId) {
            io.to(friendSocketId).emit("friend_online", { userId, isOnline: true });
          }
        });
      }
    });

    // Handle joining chat rooms
    socket.on("join_chat", (chatRoomId: string) => {
      socket.join(`chat:${chatRoomId}`);
    });

    // Handle leaving chat rooms
    socket.on("leave_chat", (chatRoomId: string) => {
      socket.leave(`chat:${chatRoomId}`);
    });

    // Handle sending messages
    socket.on("send_message", async (data: {
      chatRoomId: string;
      senderId: string;
      content: string;
      messageType?: "text" | "image" | "file";
      fileUrl?: string;
    }) => {
      try {
        const message = await storage.sendMessage({
          chatRoomId: data.chatRoomId,
          senderId: data.senderId,
          content: data.content,
          messageType: data.messageType || "text",
          fileUrl: data.fileUrl,
        });

        // Broadcast message to all users in the chat room
        io.to(`chat:${data.chatRoomId}`).emit("new_message", message);
      } catch (error) {
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    // Handle typing indicators
    socket.on("typing_start", (data: { chatRoomId: string; userId: string; userName: string }) => {
      socket.to(`chat:${data.chatRoomId}`).emit("user_typing", {
        userId: data.userId,
        userName: data.userName,
        isTyping: true
      });
    });

    socket.on("typing_stop", (data: { chatRoomId: string; userId: string }) => {
      socket.to(`chat:${data.chatRoomId}`).emit("user_typing", {
        userId: data.userId,
        isTyping: false
      });
    });

    // Handle screen sharing
    socket.on("join_screen_share", (sessionId: string) => {
      socket.join(`screen:${sessionId}`);
    });

    socket.on("leave_screen_share", (sessionId: string) => {
      socket.leave(`screen:${sessionId}`);
    });

    socket.on("screen_share_signal", (data: {
      sessionId: string;
      signal: any;
      targetId?: string;
    }) => {
      if (data.targetId) {
        // Send to specific user
        const targetSocketId = userSockets.get(data.targetId);
        if (targetSocketId) {
          io.to(targetSocketId).emit("screen_share_signal", {
            signal: data.signal,
            senderId: connectedUsers.get(socket.id)?.id
          });
        }
      } else {
        // Broadcast to all users in the screen sharing session
        socket.to(`screen:${data.sessionId}`).emit("screen_share_signal", {
          signal: data.signal,
          senderId: connectedUsers.get(socket.id)?.id
        });
      }
    });

    // Handle video call signaling
    socket.on("call_user", (data: { targetUserId: string; offer: any }) => {
      const targetSocketId = userSockets.get(data.targetUserId);
      if (targetSocketId) {
        io.to(targetSocketId).emit("incoming_call", {
          callerId: connectedUsers.get(socket.id)?.id,
          offer: data.offer
        });
      }
    });

    socket.on("answer_call", (data: { callerId: string; answer: any }) => {
      const callerSocketId = userSockets.get(data.callerId);
      if (callerSocketId) {
        io.to(callerSocketId).emit("call_answered", {
          answer: data.answer
        });
      }
    });

    socket.on("ice_candidate", (data: { targetUserId: string; candidate: any }) => {
      const targetSocketId = userSockets.get(data.targetUserId);
      if (targetSocketId) {
        io.to(targetSocketId).emit("ice_candidate", {
          candidate: data.candidate,
          senderId: connectedUsers.get(socket.id)?.id
        });
      }
    });

    socket.on("end_call", (data: { targetUserId: string }) => {
      const targetSocketId = userSockets.get(data.targetUserId);
      if (targetSocketId) {
        io.to(targetSocketId).emit("call_ended");
      }
    });

    // Handle disconnection
    socket.on("disconnect", async () => {
      console.log("User disconnected:", socket.id);
      
      const user = connectedUsers.get(socket.id);
      if (user) {
        // Update user offline status
        await storage.updateUserOnlineStatus(user.id, false);
        
        // Notify friends that user is offline
        const friends = await storage.getFriends(user.id);
        friends.forEach(friend => {
          const friendSocketId = userSockets.get(friend.id);
          if (friendSocketId) {
            io.to(friendSocketId).emit("friend_online", { 
              userId: user.id, 
              isOnline: false 
            });
          }
        });
        
        connectedUsers.delete(socket.id);
        userSockets.delete(user.id);
      }
    });
  });

  return io;
}