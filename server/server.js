const express = require("express");
const { sequelize } = require("./models");
const cors = require("cors");
const http = require("http");
const socket = require("./socket");
const setupWebSocket = require("./utils/socketHandler");

const app = express();
const server = http.createServer(app);
const PORT = parseInt(process.env.PORT) || 4000;

// Initialize Socket.IO
const io = socket.init(server);

const NODE_ENV = process.env.NODE_ENV || "development";
if (NODE_ENV === "development") {
  app.use(cors());
}

app.use(express.json());

// Routes
app.use("/api/contracts", require("./routes/contractRouter"));

// Setup WebSocket
setupWebSocket(io);

const startServer = async () => {
  try {
    // Test Database connection
    await sequelize.authenticate();
    console.log("Database connection has established successfully");

    // Sync all models with database
    await sequelize.sync({ alter: true });
    console.log("All models are synchronized successfully");

    // Start the server
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error(`Unable to start the server: ${error.message}`, { error });
    process.exit(1);
  }
};

startServer();
