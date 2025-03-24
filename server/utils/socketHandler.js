const contractService = require("../services/contractService");

const setupWebSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("A user connected");

    // Initial socket communication if needed

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};

module.exports = setupWebSocket;
