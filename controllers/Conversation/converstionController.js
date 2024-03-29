const Conversation = require("../../models/Converstion");
const Doctor = require("../../models/doctorModel");
const User = require("../../models/userModel")
//new conversation

const newConversation = async (req, res) => {

  const {senderId,recieverId} =req.body


  try {
    const  chatExist = await Conversation.findOne({
      members:{$all:[senderId,recieverId]}
    })
   
    if(chatExist){
       console.log(`chatExist${chatExist}`)
      return res.status(200).send({
        success:true,
        chatExist
      })
    }else{
      const newchat = new Conversation({
        members: [req.body.senderId, req.body.recieverId],
      });
      const savedConversation = await newchat.save();
      console.log("chat created")
      res.status(200).send({
        success: true,
        savedConversation,
      });
    }
  
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `new conversation controller ${error}`,
    });
  }
};

//get new conversation of user

const getConversation = async (req, res) => {
  try {
    console.log("conversation ")
    const userId = req.chat.id;
    // console.log(userId, "this is userid");
    const conversation = await Conversation.find({
      members: { $in: [userId] },
    });
    // console.log(conversation,"this is the list")
    res.status(200).send({
      conversation,
      success: true,
      userId,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `new conversation controller ${error}`,
    });
  }
};

const getconversationuserDetails = async (req, res) => {
  try {
    console.log(req.query.userId, "thisis query user id");
    const doctor = await Doctor.findById(req.query.userId)
    const client = await User.findById(req.query.userId)

    const user = doctor ? doctor : client

    res.status(200).send({
      success:true,
      user
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `getConverstion list conversation controller ${error}`,
    });
  }
};

module.exports = {
  newConversation,
  getConversation,
  getconversationuserDetails
};
