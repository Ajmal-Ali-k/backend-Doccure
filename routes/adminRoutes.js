const express = require('express');
const { getPendingDoctors, adminLogin, approveDocter, rejectDocter, addDepartment, getDepartments, newDoctorDetails, deleteDepartment, userList, doctorList, blockUser, UnblockUser, blockDoctor, UnblockDoctor,  } = require('../controllers/adminController');

const { adminVerify } = require('../middleware/authentication');






const router = express.Router()

router.post('/admin_login',adminLogin)
router.get("/getpendig_doctors",adminVerify,getPendingDoctors)
router.patch('/approve_doctor',adminVerify,approveDocter)
router.patch('/reject_doctor',adminVerify,rejectDocter)
router.get('/new_doctor_details',adminVerify,newDoctorDetails)
router.post('/department',adminVerify,addDepartment)
router.get('/department',adminVerify,getDepartments)
router.patch('/department',adminVerify,deleteDepartment)
router.get('/users_list',adminVerify,userList)
router.get('/doctors_list',adminVerify,doctorList)
router.patch('/block_user',adminVerify,blockUser)
router.patch('/unblock_user',adminVerify,UnblockUser)
router.patch('/block_doctor',adminVerify,blockDoctor)
router.patch('/unBlock_doctor',adminVerify,UnblockDoctor)
module.exports = router