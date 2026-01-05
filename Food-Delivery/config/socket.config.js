import { Server } from "socket.io";

let io;

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    // Join room based on user role and ID
    socket.on("join", ({ userId, role }) => {
      socket.join(`user:${userId}`);
      if (role === "restaurant") {
        socket.join(`restaurant:${userId}`);
      }
      if (role === "driver") {
        socket.join(`driver:${userId}`);
      }
      console.log(`User ${userId} joined as ${role}`);
    });

    // Join order room
    socket.on("joinOrder", ({ orderId }) => {
      socket.join(`order:${orderId}`);
      console.log(`Joined order room: ${orderId}`);
    });

    // Driver location update
    socket.on("updateLocation", ({ driverId, lat, lng }) => {
      socket.to(`driver:${driverId}`).emit("locationUpdated", { lat, lng });
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};
