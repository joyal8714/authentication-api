const user=require('../models/user')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')


exports.register=async(req,res)=>{
    const{username,email,password}=req.body

   const existing=await user.findOne({email})


   if(existing) return res.status(400).json({msg:"user allready exist"})

    const hashed=await bcrypt.hash(password,10)
    
    const user=await user.create({username,email,password:hashed})

    res.json({msg:"created succesfully"})

}
exports.login=async(req,res)=>{
    const{email,password}=req.body

const user=await user.findOne({email})
if(!user) return res.status(400 ).json({msg:"user not found"})

const isMatch=await bcrypt.compare(password,user.password) 
if(!isMatch) return res.status(400).json({msg:'invaliduser'})

const token=jwt.sign({id:user._id,username:user.username},process.env.JWT_SECRET,{expiresIn:'1d'})
res.json({msg:`hello,${user.username}!`,token})

}

