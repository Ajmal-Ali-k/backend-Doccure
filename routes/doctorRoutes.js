const express = require('express');
const { DoctorSignup, DoctorLogin, createSlot, get_slot, slotCreation, docname, changePassword, getUpcomingAppoinments, getTodayAppointments, getTotalPatients, getTotalAppointments, acceptAppoinment, cancelAppoinment, getPastAppointments, CompeleteAppoinment } = require('../controllers/doctorController');
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
router.put("/accept_appoinment",acceptAppoinment)
router.put('/cancel_appoinment',cancelAppoinment)
router.put('/compelete_appoinment',CompeleteAppoinment)
router.get('/past_appoiments',doctorVerify,getPastAppointments)



module.exports = router