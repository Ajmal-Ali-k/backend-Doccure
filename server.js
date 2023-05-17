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

app.listen(port, () => {
  console.log(`server running at port ${port}`.bgCyan.white);
});
