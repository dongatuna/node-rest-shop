const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require("../models/product");


router.get("/", (req, res, next)=>{
    Order
    .find()
    .select("product quantity _id")
    .populate('product')    
    .exec()
    .then(docs =>{
        //find the length of the result array
        //const count = docs.length;

        res.status(200).json(
            {
                count: docs.length,
                message: "The list of all the orders is below..",
                record: docs.map(doc=>{
                    return {
                        _id:doc._id,
                        product:doc.product,
                        quantity: doc.quantity,
                        url:{
                            type:"GET",
                            message: "To see more details about this order, click the link below",
                            link: "http://localhost:3000/orders/"+doc._id
                        }
                    }
                })
            }
        ); 

       // res.status(200).json(response);
    })
    .catch(err =>{
        res.status(500).json({
            error: err
        });
    });
})

router.post('/', (req, res, next)=>{

    Product.findById(req.body.productId)
    .then(product=>{

        if(!product){
            return res.status(404).json({
                message: "Product not found"
            });
        }


        const order = new Order({
            _id: new mongoose.Types.ObjectId(),
            product: req.body.productId,
            quantity: req.body.quantity
        });
    
        return order.save()
        .then(docs=>{
            console.log(docs);
            response ={
                message: "The order was successfully created",
                createdOrder:{
                    _id: docs._id,
                    quantity: docs.quantity,
                    product: docs.product
                },
    
                url:{
                    type:"GET",
                    message: "To view the order in great details, see below...",
                    link: 'http://localhost:3000/orders/'+docs._id
                }
            };
    
            res.status(201).json(response);
        })
        .catch(err =>{
                res.status(500).json({
                    error: err
                });
            }
        );
    })
    
     
});

router.get('/:orderId', (req, res, next)=>{
    //fetch the id
    const id = req.params.orderId;

    Order
    .findById(id)
    .populate('product') 
    .exec()
    .then(docs =>{
        if(!docs){
            return res.status(404).json({
                message: "No such order exists"
            });
        }
        res.status(200).json({
            order: docs,
           // id:docs.id,
            
            url:{
                message:"To see all the orders click the link below",
                type: "GET",
                link: "http://localhost:3000/orders"
            }
        });
    })
    .catch(err =>{
        res.status(500).json({
            error: err
        });
    });

    
});


router.delete('/:orderId', (req, res, next)=>{
    const id = req.params.orderId;

    Order
    .remove({_id:id})
    .exec()
    .then(doc =>{
        res.status(200).json({
            message: 'Your order has been deleted',
            
            url:{
                message:"You can create another order by using the link below",
                type:"POST",
                link: "http://localhost:3000/orders",
                body:{
                    productId: "ID",
                    quantity: "Number"
                }
                
            }
        });
    }
       
    )
    .catch(err =>{
            res.status(500).json({
                error: err
            });
        }
    );
    
});
module.exports = router;