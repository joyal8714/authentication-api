const express=require("express")
const router = express.Router();
const authController = require('../controllers/authcontroler');




router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh', authController.refreshToken);
module.exports=router

