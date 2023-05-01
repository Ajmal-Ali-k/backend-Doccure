const express = require('express');
const { loginController, registerController, approvedDoctors,getDepartments,filteredDoctors,doctorDetails } = require('../controllers/userController');

const {clientVerify}= require('../middleware/authentication')


//router object
const router = express.Router()


//routers

router.post('/login',loginController)
router.post('/signup',registerController)
// router.post('/Doctors',approvedDoctors)
router.get('/departments',getDepartments)
router.get('/Doctors',clientVerify,approvedDoctors)
router.post('/filteredDoctors',clientVerify,filteredDoctors)
router.get('/doctorDetail',clientVerify,doctorDetails)
module.exports = router