const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/Users')

// register a new user
router.post('/register', async (req,res)=> {
    try{
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword =await bcrypt.hash(password, salt);
        const newUser = {
            username: req.body.username,
            email: req.body.email,
            password:hashedPassword
        }
        const user =await User.create(newUser);
        res.status(201).json(user)
    }catch(err){
        console.log(err)
        res.status(400).json(JSON.stringify(err))
    }
})


// login user
router.post('/login',async (req,res)=>{
    try {
        const user = await User.findOne({username:req.body.username});
        if (!user) return res.status(400).json(`not user matches '${req.body.username}'`);
        const password = await bcrypt.compare(req.body.password, user.password);
        if(!password) return  res.status(400).json('wrong password');
        res.status(200).json(user);
    } catch (err) {
        console.log(err)
        res.status(500).json(err);
    }
})

//update user
router.put('/:id', async(req,res)=>{
    if(req.params.id === req.body._id || req.user.isAdmin){
        if(req.body.password){
            try {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password,salt);
            } catch (err) {
                return res.status(500).json(err)
            }
        }
        try {
            const user = await User.findByIdAndUpdate(req.body._id,{
                $set: req.body
            })
            res.status(200).json(user)
        } catch (err) {
            return res.status(500).json(err)
        }
    }else{
        return res.status(500).json("You can update your profile only!!");
    }
})


// delete user 

router.delete('/:id', async (req,res)=>{
    if( req.body._id === req.params.id || req.user.isAdmin){
        try {
            const user = await User.findOne({_id:req.body._id});
            if(user){
                console.log(user)
                await User.findByIdAndDelete({_id:req.body._id});
                res.status(204).json("message:Your account has been removed successfully");
            }else{
                res.status(400).json("No user matches this id");
            }
            
        } catch (err) {
            console.log(err)
            res.status(500).json(err)
        }
    }else {
        res.status(500).json("You can remove your account only!!")
    }
})

// get user
router.get('/:id', async (req,res)=>{
    try {
        const user = await User.findById(req.params.id);
        const {password, isAdmin, ...others} = user._doc
        user && res.status(200).json(others);
    } catch (err) {
        res.status(400).json(err);
    }
})
// follow
router.put('/:id/follow', async (req, res)=> {
    if(req.body._id !== req.params.id){
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body._id);
            if(!user.followers.includes(req.body._id)){
                await user.updateOne({
                    $push:{followers:currentUser._id}
                })
                await currentUser.updateOne({
                    $push: {following:user._id}
                })
                res.status(201).json(`You have followed '${user.username}' successfully`)
            }else{
                res.status(400).json("you already follow this user");
            }
            
        } catch (err) {
            res.status(400).json(err)
        }
    }else{
        res.status(400).json("You cannot follow yourself");
    }
})
// unfollow
router.put('/:id/unfollow', async (req,res)=>{
    if(req.body._id !== req.params.id){
        try {
            const user = await User.findById(req.params.id);
            const currentUser =await User.findById(req.body._id);

            if(user.followers.includes(currentUser._id)){
                await user.updateOne({
                    $pull: {followers: currentUser._id}
                })
                await currentUser.updateOne({
                    $pull: {following: user._id}
                })
                res.status(200).json(`You unfollow '${currentUser.username}' successfully` )
            }else(
                res.status(400).json("You can unfollow only who's you are following")
            )
        } catch (err) {
            console.log(err)
            res.status(400).json(err)
        }
    }else{
        res.status(400).json("You cannot follow/unfollow yourself")
    }
})
module.exports = router