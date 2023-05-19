const messsages = require("../../models/Message");

//add

const new_message = async (req, res) => {

  const { text } = req.body.message;
  if (text === null) {
    return res.status(200).send({
      message: `type something`,
      success: false,
    });
  }
  const new_message = new messsages(req.body.message);
  try {
    const savedMessage = await new_message.save();

    res.status(200).send({
      savedMessage,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: true,
      messsage: `new message controller ${error}`,
    });
  }
};

//get
const get_message = async (req, res) => {
  try {
    const messages = await messsages.find({
      conversationId: req.params.conversationId,
    });

    res.status(200).send({
      messages,
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      success: true,
      messsage: `get message controller ${error}`,
    });
  }
};
module.exports = {
  new_message,
  get_message,
};
