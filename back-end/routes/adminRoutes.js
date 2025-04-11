const express = require('express')
const admin = require('../models/admin')
const route = express.Router();

route.get('/', async (req,res)=> {
    try{
        const data = await admin.find();
        res.status(200).json(data);
    }catch(err){
        res.status(500).json({message:'Error'})
    }
})

// route.post('/admin', async(req, res)=>{
//     try{
//         const admindetail = req.body;
//         const newadmin = new admin(admindetail);
//         const resadminData = await newadmin.save();
//         res.status(200).json(resadminData);
//     }catch(err){
//         console.log(err);
//         res.status(500).json({message:'Error'});
//     }
// })
module.exports = route;
