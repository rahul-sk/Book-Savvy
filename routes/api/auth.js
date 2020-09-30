const express=require('express');
const router=express.Router();
const auth=require('../../middleware/auth');
const User=require('../../models/User');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const config=require('config');
const {check,validationResult} = require('express-validator/check');


router.get('/', auth,async function(req,res){
    try{
        const user=await User.findById(req.user.id).select('-password');
        res.json(user);
    }
    catch(err){
       console.error(error.message);
       res.status(500).send('server error');
    }
});



router.post('/', [
    check("email","Please enter a valid Email ID").isEmail(),
    check("password","please enter a password of minimum 6 characters").exists()
],async function(req,res){
    const err=validationResult(req);
    if(!err.isEmpty()){
        return res.status(400).json({errors : err.array()});
    }
    
    const {email,password} = req.body;
    try{
         let user=await User.findOne({email});
         if(!user){
             return res.status(400).json({error : [{msg : "Invalid Credientials"}]});
         }
        
         const isMatch=await bcrypt.compare(password,user.password);
         if(!isMatch){
            return res.status(400).json({error : [{msg : "Invalid Credientials"}]});

         }

         const payload={
             user:{
                 id:user.id
             }
         }
         jwt.sign(payload,config.get('jwtSecret'),{
             expiresIn:360000
         },(err,token)=>{
             if(err) throw err;
             res.json({token});
         });

        // res.send("user Registered successfully :)");
    } catch(err){
     console.error(err.message);
     res.status(500).send('Server Error :(');
    }

      
}); 





module.exports=router;
