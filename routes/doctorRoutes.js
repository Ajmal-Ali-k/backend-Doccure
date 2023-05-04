const express = require('express');
const { DoctorSignup, DoctorLogin } = require('../controllers/doctorController');



const router = express.Router()



router.post('/signup',DoctorSignup)
router.post('/login',DoctorLogin)



module.exports = router