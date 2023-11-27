const {getUser,getUserRestrictData,saveUser,resetPassword,passwordUpdate,Signin}=require('../controller/userController')

const router=require('express').Router();

router.get('/',getUserRestrictData)
router.get('/users',getUser)
router.post('/createuser',saveUser)
router.put('/forgotpassword',resetPassword)
router.patch('/passwordreset/:id',passwordUpdate)
router.post('/signin',Signin)
 
module.exports=router; 