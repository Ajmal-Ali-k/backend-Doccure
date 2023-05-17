const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: String,
    },
    sender:{
        type:String
    },
    text:{
        type:String
    }
  },
  { timestamps: true }
);

const MessageModel = mongoose.model("Message", MessageSchema);
module.exports = MessageModel;
