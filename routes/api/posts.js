const express=require('express');
const router=express.Router();
const auth=require('../../middleware/auth');
const {check,validationResult}=require('express-validator/check');
const Profile=require('../../models/Profile');
const User=require('../../models/User');
const Post=require('../../models/Post');

router.post('/', [ auth,[
    check('text','Text is required').not().isEmpty()
]] ,async function(req,res){
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    try{
        const user=await User.findById(req.user.id).select('-password');
        const newPost= new Post({
            text:req.body.text,
            name:user.name,
            avatar:user.avatar,
            user:req.user.id
        });
        const post=await newPost.save();
        res.json(post);
      
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.get('/',auth,async function(req,res){
    try{
        const posts=await Post.find().sort({date : -1});
        res.json(posts);

    }
    catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

router.get('/:id',auth,async function(req,res){
    try{
        const post=await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({msg:"Post not found"});
        }
        res.json(post);

    }
    catch(err){
        console.error(err.message);
        if(err.kind === 'ObjectId'){
            return res.status(404).json({msg:"Post not found"});
        }
        res.status(500).send('Server Error');
    }
})

router.delete('/:id',auth,async function(req,res){
    try{
       
    const post=await Post.findById(req.params.id);
    if(!post){
        res.status(404).json({msg :'Post not found'});
    }
    if(post.user.toString() !== req.user.id){
        res.status(401).json({msg : "User not authorised"});
    }
    await post.remove();
    res.json({msg : 'post removed'});
    }
    catch(err){
        console.log(err.message);
        if(err.kind === 'ObjectId'){
            res.status(404).json({msg :'Post not found'});
        }
        res.status(500).send('Server Error');
    }
})

router.put('/likes/:id', auth , async function(req,res){
    const post=await Post.findById(req.params.id);
    if(post.user.toString()===req.user.id){
        return res.status(400).json({msg: 'You cannot like your own post'});

    }
    if(post.likes.filter(x => x.user.toString()===req.user.id).length>0){
        return res.status(400).json({msg: 'Post is already liked'});

    }
    post.likes.unshift({user : req.user.id});
    await post.save();

    res.json(post.likes)

});

router.put('/unlike/:id', auth , async function(req,res){
    const post=await Post.findById(req.params.id);
    // if(post.user.toString()===req.user.id){
    //     return res.status(400).json({msg: 'You cannot like your own post'});

    // }
    if(post.likes.filter(x => x.user.toString()===req.user.id).length==0){
        return res.status(400).json({msg: 'Post is not yet been liked'});

    }
    const idx=post.likes.map(x=> x.user.toString()).indexOf(req.user.id);
    post.likes.splice(idx,1); 
    await post.save();

    res.json(post.likes)

})

router.post('/comment/:id', [ auth , [
    check('text','Text is required').not().isEmpty()
]] , async function(req,res){
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        res.status(400).json({errors : errors.array()});
    }
    try{
        const user=await User.findById(req.user.id).select('-password');
        const post=await Post.findById(req.params.id);
        const newComment={
            text:req.body.text,
            name:user.name,
            avatar:user.avatar,
            user:req.user.id
            
            
        }
        post.comments.unshift(newComment);
        await post.save();
        res.json(post.comments);

    }catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


router.delete('/comment/:id/:comment_id', auth , async function(req,res){

    try{
        const post=await Post.findById(req.params.id);
        const comment=post.comments.find(x => x.id === req.params.comment_id);
        if(!comment){
            return res.status(404).json({msg : "Comment not found"});
        }
        if(comment.user.toString() != req.user.id){
            return res.status(401).json({msg : "User not authorized"});
        }
        const idx=post.comments.map(x => x.user.toString()).indexOf(req.user.id);
        post.comments.splice(idx,1);

        await post.save();
        res.json(post.comments);

    }catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    }
});



module.exports=router;
