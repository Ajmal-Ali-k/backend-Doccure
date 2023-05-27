const { Server } = require("socket.io");
const colors = require("colors");

function socketConnections(server) {
  console.log("socket connection calling".bgYellow.white);
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
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

    // socket.on("addUser", (userId) => {
    //   addUser(userId, socket.id);
    //   io.emit("getUser", users);
    // });

    // //send and get message
    // socket.on("sendMessage", ({ senderId, recieverId, text }) => {
    //   const user = getUser(recieverId);
    //   io.to(user?.socketId).emit("getMessage", {
    //     senderId,
    //     text,
    //   });
    // });

    // //when disconnect

    // socket.on("disconnect", () => {
    //   console.log("a user disconnected".bgRed.white);
    //   removeUser(socket.id);
    //   io.emit("getUser", users);
    // });

    //   video call #########################
    socket.emit('me',socket.id)
    socket.on('disconnect', () =>{
        socket.broadcast.emit("callended")
    })
    socket.on('calluser',({userToCall,signalData,from,name})=>{
        io.to(userToCall).emit("calluser",{signal:signalData,from,name})

    })
    socket.on("answerCall",(data)=>{
        io.to(data.to).emit("callaccepted",data.signal)
    })
  });
}

module.exports = socketConnections;
