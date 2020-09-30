const express=require('express');
const router=express.Router();
const gravatar = require('gravatar');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const config=require('config');
const {check,validationResult} = require('express-validator/check');

const User=require('../../models/User');
router.post('/', [
    check('name',"Name is required").not().isEmpty(),
    check("email","Please enter a valid Email ID").isEmail(),
    check("password","please enter a password of minimum 6 characters").isLength({min:6})
],async function(req,res){
    const err=validationResult(req);
    if(!err.isEmpty()){
        return res.status(400).json({errors : err.array()});
    }
    
    const {name,email,password} = req.body;
    try{
         let user=await User.findOne({email});
         if(user){
             return res.status(400).json({error : [{msg : "User already Exists"}]});
         }
         const avatar=gravatar.url(email,{
             s:'200',
             r:'pg',
             d:'mm'
         });
         user =new User({
             name,
             email,
             password,
             avatar
         })

         const salt=await bcrypt.genSalt(10);
         user.password=await bcrypt.hash(password,salt);
         await user.save();

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
