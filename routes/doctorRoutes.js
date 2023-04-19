const express = require('express');
const { DoctorSignup } = require('../controllers/doctorController');



const router = express.Router()



router.post('/signup',DoctorSignup)



module.exports = router