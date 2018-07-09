const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require("../models/product");

router.get('/', (req, res, next)=>{
     Order
    .find()
    .exec()
    .then(orders =>{
        
        count = orders.length;

        const response = {
            count: count,
            message:"The list of all the orders",
            order: orders.map(item=>{
                return{
                    id: item._id,
                    quantity: item.quantity,
                    product: item.product,

                    url:{
                        type: "GET",
                        link: 'http://localhost:3000/orders/'+item._id
                    }
                }
            })
          
        }
        res.status(200).json(response);
    })
    .catch(err=>{
        res.status(500).json({
            error: err
        });
    });
   
});

router.post('/', (req, res, next)=>{
    const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        product: req.body.productId,
        quantity: req.body.quantity
    });
    order
    .save()
    .then(docs=>{
        console.log("Orders: docs");
        response ={
            message: "The order was successfully created",
            quantity: docs.quantity,
            product: docs.product,

            url:{
                type:"GET",
                message: "To view the order in great details, see below...",
                link: 'http://localhost:3000/orders/'+docs._id
            }
        }
    })
    .catch()
    res.status(201).json({
        message: 'Order was created', 
        order:order
    });
});

router.get('/:orderId', (req, res, next)=>{
    res.status(200).json({
        message: 'Order details',
        OrderId: req.params.orderId
    });
});

router.delete('/:orderId', (req, res, next)=>{
    res.status(200).json({
        message: 'Order deleted',
        OrderId: req.params.orderId
    });
});
module.exports = router;