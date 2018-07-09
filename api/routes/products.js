const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Product = require("../models/product");

router.get("/", (req, res, next) => {
  Product
  .find()
  .select("name price _id") //select the fields you want to get
  .exec()
  .then(docs=>{
    const count = docs.length;

    if(count>0){

      const response = {
        count: count,
        products: docs.map(doc=>{
          return{
            name: doc.name,
            price: doc.price,
            id: doc._id,

            request: {
              type: "GET",
              link:'http://localhost:3000/products/'+doc._id
            }
          }          
        })
      }
      res.status(200).json({response});
    }else{
      res.status(404).json({
        message: "There are no products at the moment "
      });
    }
  })
  .catch(err=>{
    console.log(err);
    res.status(500).json({
      error:err
    });
  });

});

router.post("/", (req, res, next) => {
  //first, create an instance of the product based on the mongoose Schema
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price
  });

  product
  .save()
  .then(result =>{
    console.log(result);
    res.status(201).json({
      message:"The entry was successful",
      createdProduct: {
        name: result.name,
        price: result.price,
        ID: result._id,

        request:{
          type: "GET",
          url: 'http://localhost:3000/products/'+result._id
        }
      }
    });
  })
  .catch(err =>{
    console.log(err);

    res.status(500).json({
      error :err
    });
  });
 
});

router.get("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
  .select('name price _id')
  .exec()
  .then(doc => {
    console.log(doc);

    res.status(200).json({
      message:"See the specific product you requested",
      specificProduct:{
        name: doc.name,
        price: doc.price,
        request:{
          type: "GET",
          message: "See all products",
          link: 'http://localhost:3000/products'

        }
      }
    });
  })
  .catch(err =>{
    console.log(err);
    res.status(500).json({
      err: error
    });
  });
  
});

router.patch("/:productId", (req, res, next) => {
  const id = req.params.productId;

  const updateOps = {};

  for(const ops of req.body){
    updateOps[ops.propName] = ops.value;
  }

  Product.update({_id:id}, {$set:updateOps})
  .exec()
  .then(result =>{
    
    res.status(200).json(
      {
        message: "Product has successfully been updated",
        request:{
          type: "GET",
          url: "http://localhost:3000/products/"+id
        }
      }
    );
  })
  .catch(err => {
    console.log(err);

    res.status(500).json({
      error:err
    });
  })

});

router.delete("/:productId", (req, res, next) => {
  const id = req.params.productId;

  Product.remove({_id: id})
  .exec()
  .then(doc=>{
    res.status(200).json({
      message: "The product has been successfully removed",
      request:{
        type: "POST",
        url: 'http://localhost:3000/products',
        message: "Create new products using these data type...",
        data: {
          name: "String",
          price: "Number"
        }
      }
    });
  })
  .catch(err=>{
    res.status(500).json({
      error: err
    });
  });
});

router.delete('/', (req, res, next)=>{
  Product
  .remove({})
  .exec()
  .then(docs=>{
    if(docs.length < 1){
      console.log("All the products have been deleted");
    }
  }
).catch();
});

module.exports = router;