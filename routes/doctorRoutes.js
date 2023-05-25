const express = require('express');
const { DoctorSignup, DoctorLogin, createSlot, get_slot, slotCreation, docname, changePassword, getUpcomingAppoinments, getTodayAppointments, getTotalPatients, getTotalAppointments } = require('../controllers/doctorController');
const {doctorVerify}=require('../middleware/authentication');



const router = express.Router()



router.post('/signup',DoctorSignup)
router.post('/login',DoctorLogin)
router.post('/create_slot',doctorVerify,slotCreation)
router.get('/getSlot',doctorVerify,get_slot)
router.get('/getDocname',doctorVerify,docname)
router.post('/change_password',doctorVerify,changePassword)
router.get('/upcomingAppoinments',doctorVerify,getUpcomingAppoinments)
router.get('/todayAppoinments',doctorVerify,getTodayAppointments)
router.get('/totalpatients',doctorVerify,getTotalPatients)
router.get('/totalAppoiments',doctorVerify,getTotalAppointments)



module.exports = router