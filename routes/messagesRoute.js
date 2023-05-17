const express = require('express');
const {chatVerify}= require('../middleware/authentication')

const message = require('../models/Message');
const { new_message, get_message } = require('../controllers/Conversation/messageController');



const router = express.Router()

router.post('/',chatVerify,new_message)
router.get('/:conversationId',chatVerify,get_message)





module.exports = router
