const express=require('express');
const router=express.Router();
const Profile=require('../../models/Profile');
const User=require('../../models/User');
const Post=require('../../models/Post');

const auth=require('../../middleware/auth');
const {check,validationResult} = require('express-validator/check');
const { json } = require('express');
const config=require('config');
const request=require('request');

router.get('/me',auth,async function(req,res){
    try{
        const profile=await Profile.findOne({user : req.user.id}).populate('user',['name','avatar']);
    if(!profile){
       return res.status(400).json({msg: "There is no profile for this user"});
    }
    res.json(profile);
    }
    catch(err){
        console.error(err.message);
        res.status(500).send('Server error :((');
    }

});

router.post('/', [auth,[
    check('status','Status is required').not().isEmpty(),
    check('skills','Skills is required').not().isEmpty()
]],async function(req,res){
    const errors=validationResult(req);
    if(!errors.isEmpty()){
       return res.status(400).json({errors: errors.array()});
    }
    
    const{
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin
    } = req.body;
    const profileFields={};
    profileFields.user=req.user.id;
    if(company) profileFields.company=company;
    if(website) profileFields.website=website;
    if(location) profileFields.location=location;
    if(bio) profileFields.bio=bio;
    if(status) profileFields.status=status;
    if(githubusername) profileFields.githubusername=githubusername;
    if(skills){
        profileFields.skills=skills.split(',').map(x => x.trim());
    }


     profileFields.social={};
     if(youtube) profileFields.social.youtube=youtube;
     if(twitter) profileFields.social.twitter=twitter;
     if(facebook) profileFields.social.facebook=facebook;
     if(linkedin) profileFields.social.linkedin=linkedin;
     if(instagram) profileFields.social.instagram=instagram;
     
      try{
       let profile=await Profile.findOne({user : req.user.id});
       if(profile){
          profile = await Profile.findOneAndUpdate({user : req.user.id},{$set : profileFields},{new : true});
          return res.json(profile);
       }

       profile=new Profile(profileFields);
       await profile.save();
       return res.json(profile);
      }catch(err){
        console.error(err.message);
        res.status(500).json('server error :((');
      }
    
});

router.get('/',async function(req,res){
    try{
        const profiles=await Profile.find().populate('user',['name','avatar']);
        res.json(profiles);  
    }catch(err){
        console.error(err.message);
        res.status(500).send('server error');
    }
});

router.get('/user/:user_id',async function(req,res){
    try{
        const profile=await Profile.findOne({user:req.params.user_id}).populate('user',['name','avatar']);
        if(!profile) return res.status(400).json({msg: "Profile not found"});
        res.json(profile);  
    }catch(err){
        console.error(err.message);
        if(err.kind=='ObjectId'){
            return res.status(400).json({msg: "Profile not found"});
        }
        res.status(500).send('server error');
    }
});


router.delete('/',auth,async function(req,res){
    try{
        await Post.deleteMany({user:req.user.id}); 
        await Profile.findOneAndRemove({user : req.user.id});
        await User.findOneAndRemove({ _id : req.user.id});
        res.json({msg : "user deleted"});   
    }catch(err){
        console.error(err.message);
        res.status(500).send('server error');
    }
});


router.put('/experience',[ auth,[
    check('company','company is required').not().isEmpty(),
    check('title','title is required').not().isEmpty(),
    check('from','from date is required').not().isEmpty()
]],async function(req,res){
     
    const err=validationResult(req);
        if(!err.isEmpty()){
            return res.status(400).json({errors : err.array()});
            
        } 
        const{
            title,
            company,
            location,
            from,
            to,
            current,
            description
        }=req.body;
       const newExp={
        title,
        company,
        location,
        from,
        to,
        current,
        description

       }


    try{
       const profile=await Profile.findOne({user : req.user.id});
       profile.experience.unshift(newExp);
       await profile.save()
       res.json(profile); 


    }catch(err){
        console.error(err.message);
        res.status(500).send('server error');
    }
});

router.delete('/experience/:exp_id', auth,async function(req,res){
    try{
        const profile=await Profile.findOne({user : req.user.id});
        const idx=profile.experience.map(x => x.id).indexOf(req.params.exp_id);
        profile.experience.splice(idx,1);
        await profile.save();

        res.json(profile);  
    }catch(err){
        console.error(err.message);
        res.status(500).send('server error');
    }
});


router.put('/education',[ auth,[
    check('school','school is required').not().isEmpty(),
    check('degree','degree is required').not().isEmpty(),
    check('fieldofstudy','field of study is required').not().isEmpty()
]],async function(req,res){
     
    const err=validationResult(req);
        if(!err.isEmpty()){
            return res.status(400).json({errors : err.array()});
            
        } 
        const{
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description
        }=req.body;
       const newEdu={
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description

       }


    try{
       const profile=await Profile.findOne({user : req.user.id});
       profile.education.unshift(newEdu);
       await profile.save()
       res.json(profile); 


    }catch(err){
        console.error(err.message);
        res.status(500).send('server error');
    }
});

router.delete('/education/:edu_id', auth,async function(req,res){
    try{
        const profile=await Profile.findOne({user : req.user.id});
        const idx=profile.education.map(x => x.id).indexOf(req.params.edu_id);
        profile.education.splice(idx,1);
        await profile.save();

        res.json(profile);  
    }catch(err){
        console.error(err.message);
        res.status(500).send('server error');
    }
});


// @route    GET api/profile/github/:username
// @desc     Get user repos from Github
// @access   Public
router.get('/github/:username',async (req, res) => {
    try {
        const options = {
            uri: `https://api.github.com/users/${
                req.params.username
            }/repos?per_page=5&sort=created:asc&client_id=${config.get(
                'githubClientId'
            )}&client_secret=${config.get('githubSecret')}`,
            method: 'GET',
            headers: { 'user-agent': 'node.js' },
        };

        request(options, (error, response, body) => {
            if (error) console.error(error);

            if (response.statusCode !== 200) {
                return res.status(404).json({ msg: 'No Github profile found' });
            }

            res.json(JSON.parse(body));
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


module.exports=router;