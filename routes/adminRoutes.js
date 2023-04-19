const express = require('express');
const { getPendingDoctors, adminLogin, approveDocter, rejectDocter, addDepartment, getDepartments, newDoctorDetails, deleteDepartment,  } = require('../controllers/adminController');







const router = express.Router()

router.post('/admin_login',adminLogin)
router.get("/getpendig_doctors",getPendingDoctors)
router.patch('/approve_doctor',approveDocter)
router.patch('/reject_doctor',rejectDocter)
router.get('/new_doctor_details',newDoctorDetails)
router.post('/department',addDepartment)
router.get('/department',getDepartments)
router.patch('/department',deleteDepartment)



module.exports = router