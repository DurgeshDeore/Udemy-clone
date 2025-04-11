const express = require('express')
const user = require('../models/user')
const route = express.Router();

route.get('/', async (req,res)=> {
    try{
        const data = await user.find();
        res.status(200).json(data);
    }catch(err){
        res.status(500).json({message:'Error'})
    }
})

route.post('/', async(req, res)=>{
    try{
        const userdetail = req.body;
        const newuser = new user(userdetail);
        const resUserData = await newuser.save();
        res.status(200).json(resUserData);
    }catch(err){
        console.log(err);
        res.status(500).json({message:'Error'});
    }
})
module.exports = route;
