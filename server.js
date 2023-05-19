const express = require("express");
const colors = require("colors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const helmet = require("helmet");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const adminRoutes = require("./routes/adminRoutes");
const conversationRoutes = require("./routes/conversationRoute");
const messageRoutes = require("./routes/messagesRoute");
const cors = require("cors");
const { Server } = require("socket.io");

dotenv.config();
//rest object
const app = express();
app.use(cors());
app.use(helmet({ crossOriginResourcePolicy: true }));

//mongodb connection
connectDB();

//middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(morgan("dev"));

//routes
app.use("/conversations", conversationRoutes);
app.use("/messages", messageRoutes);
app.use("/doctors", doctorRoutes);
app.use("/admin", adminRoutes);
app.use("/", userRoutes);

//listen port
const port = process.env.PORT;

const server = app.listen(port, () => {
  console.log(`server running at port ${port}`.bgCyan.white);
});

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

let users = [];
const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};
const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};
const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  //when connect

  console.log("Socket server connected".bgMagenta.white);

  //take userid and socket id from user

  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUser", users);
  });

  //send and get message
  socket.on("sendMessage", ({senderId,recieverId,text}) => {
    const user = getUser(recieverId);
    io.to(user?.socketId).emit("getMessage", {
      senderId,
      text,
    });
  });

  //when disconnect

  socket.on("disconnect", () => {
    console.log("a user disconnected".bgRed.white);
    removeUser(socket.id);
    io.emit("getUser", users);
  });
});
