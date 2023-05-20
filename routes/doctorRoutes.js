const express = require('express');
const { DoctorSignup, DoctorLogin, createSlot, get_slot, slotCreation } = require('../controllers/doctorController');
const {doctorVerify}=require('../middleware/authentication')


const router = express.Router()



router.post('/signup',DoctorSignup)
router.post('/login',DoctorLogin)
router.post('/create_slot',doctorVerify,slotCreation)
router.get('/getSlot',doctorVerify,get_slot)



module.exports = router