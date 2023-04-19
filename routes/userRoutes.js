const express = require('express');
const { loginController, registerController, approvedDoctors,getDepartments } = require('../controllers/userController');



//router object
const router = express.Router()


//routers

router.post('/login',loginController)
router.post('/signup',registerController)
router.post('/approved',approvedDoctors)
router.get('/departments',getDepartments)

module.exports = router