    require('dotenv').config();
    const express=require('express');
    const mongoose= require("mongoose");
    const authroutes=require('./routes/authroutes');
    const auth=require('./middleware/auth');


    const app=express();


    app.use(express.json());
    mongoose.connect('mongodb://127.0.0.1:27017/simple-auth');

    app.use('/api/auth',authroutes)


    app.get('/api/profile',auth,(req,res)=>{
        res.json({msg:`Hello, ${req.user.username}`})
    })

    app.listen(5000,()=>console.log('server running on port 5000'))