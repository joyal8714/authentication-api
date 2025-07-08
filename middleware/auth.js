const jwt=require('jsonwebtoken')


const auth=(req,res,next)=>{
    const token=req.headers.authorization?.split("")[1];
if(!token)return res.status(401).json({msg:"no token"})



    jwt.verify(token,process.env.JWT_SECRET,(err,decoded)=>{
        if(err) return res.status(403).json({msg:"token is wrong"})


            req.user=decoded

next();
        })


}
module.exports=auth