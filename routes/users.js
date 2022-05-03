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
module.exports = router