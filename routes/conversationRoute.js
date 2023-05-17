const express = require('express');
const {chatVerify} =require('../middleware/authentication')
const Conversation = require('../models/Converstion');
const { newConversation, getConversation, getconversationuserDetails } = require('../controllers/Conversation/converstionController');




const router = express.Router()



//new converesation
router.post('/conversation',newConversation)
router.get("/",chatVerify,getConversation)
router.get('/userlist',chatVerify,getconversationuserDetails)

//get conv of user







module.exports = router
