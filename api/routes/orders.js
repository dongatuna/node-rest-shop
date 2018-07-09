const express = require('express');
const router = express.Router();
const Order = require('../models/order');

router.get('/', (req, res, next)=>{
    Orders.find()
    .exec()
    .then(orders =>{
        res.status(200).json({
            message: 'Orders were fetched'
        });
    })
    .catch();
   
});

router.post('/', (req, res, next)=>{
    const order = {
        productId: req.body.productId,
        quantity: req.body.quantity
    }
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