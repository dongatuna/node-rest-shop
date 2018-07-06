const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

const Product = require("../models/product");

router.get('/', (req, res, next)=>{
    res.status(200).json({
        message: 'Handling GET request to /products'
    });
});

router.post('/', (req, res, next)=>{

    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price:req.body.price
    });

    product.save().then(result=>{
        console.log(result)
    })
    .catch(err => console.log(err));
    res.status(201).json({
        message: 'Handling POST request to /products',
        createdProduct: product
    });
});

router.get('/:id', (req, res, next)=>{
    const id = req.params.id;

    if(id === 'special'){
        res.status(200).json({
            message: 'You discovered the special ID',
            id: id
        });
    }else{
        res.status(200).json({
            message: 'You passed an ID'
        });
    }
});

router.patch('/:id', (req, res, next)=>{
    
    res.status(200).json({
        message: 'Updated product!'
    })
});

router.delete('/:id', (req, res, next)=>{
    
    res.status(200).json({
        message: 'Deleted product!'
    })
});
module.exports = router;