import { getIO } from "../config/socket.config.js";

export const emitToUser = async (userId, event, data) => {
  const io = getIO();
  io.to(userId).emit(event, data);
};

export const emitToAdmins = async (event, data) => {
  const io = getIO();
  io.to("admins").emit(event, data);
};

export const joinUserRoom = async (socket, userId, role) => {
  socket.join(userId);
  if (role === "admin") {
    socket.join("admins");
  }
  console.log("User joined", role);
};
