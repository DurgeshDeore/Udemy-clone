const express = require('express')
const course = require('../models/course')
const route = express.Router();

route.get('/', async (req,res)=> {
    try{
        const data = await course.find();
        res.status(200).json(data);
    }catch(err){
        res.status(500).json({message:'Error'})
    }
})

route.post('/', async(req, res)=>{
    try{
        const coursedetail = req.body;
        const newcourse = new course(coursedetail);
        const resCourseData = await newcourse.save();
        res.status(200).json(resCourseData);
    }catch(err){
        console.log(err);
        res.status(500).json({message:'Error'});
    }
})
module.exports = route;
