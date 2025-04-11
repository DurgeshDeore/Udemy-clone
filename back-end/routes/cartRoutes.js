const express = require('express')
const cart = require('../models/cart')
const route = express.Router();

route.get('/', async (req,res)=> {
    try{
        const data = await cart.find();
        res.status(200).json(data);
    }catch(err){
        res.status(500).json({message:'Error'})
    }
})

route.post('/', async(req, res)=>{
    try{
        const cartdetail = req.body;
        const newcart = new cart(cartdetail);
        const resCartData = await newcart.save();
        res.status(200).json(resCartData);
    }catch(err){
        console.log(err);
        res.status(500).json({message:'Error'});
    }
})
module.exports = route;
