const { Server } = require("socket.io");
const colors = require("colors");

function socketConnections(server) {
  console.log("socket connection calling".bgYellow.white);
  const io = new Server(server, {
    cors: {
      origin: "https://main.d3asox4cw6fe34.amplifyapp.com",
      methods: ["GET", "POST"],
    },
  });
  

  // this is from chat
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

    console.log(`Socket server connected,${socket.id}`.bgWhite.white);


    //thsi sis traversy meadia
    //take userid and socket id from user

    socket.on("addUser", (userId) => {
      addUser(userId, socket.id);
      io.emit("getUser", users);
    });

    //send and get message
    socket.on("sendMessage", ({ senderId, recieverId, text }) => {
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

 

    /***********video call***************/
    const emailToSocketIdMap = new Map();
    const socketIdEmailMap = new Map();

    socket.on("room:join",(data)=>{
    const {email,room}=data
    emailToSocketIdMap.set(email,socket.id);
    socketIdEmailMap.set(socket.id,email)
    io.to(room).emit('user:joined',{email,id:socket.id})
    socket.join(room)
    io.to(socket.id).emit('room:join',data)

    })

    socket.on('user:call',({to,offer}) =>{
      io.to(to).emit('incomming:call',{from :socket.id,offer})
    })
    socket.on('call:accepted',({to,ans})=>{
      io.to(to).emit('call:accepted',{from :socket.id,ans})
    })
    socket.on("peer:nego:needed",({to,offer})=>{
      io.to(to).emit('peer:nego:needed',{from :socket.id,offer})

    })
    socket.on("peer:nego:done",({to,ans})=>{
      io.to(to).emit('peer:nego:final',{from :socket.id,ans})
    })
  });
}

module.exports = socketConnections;
