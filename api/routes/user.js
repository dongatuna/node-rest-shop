const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

//import the User model
const User = require("../models/user");

router.post('/signup', (req, res, next) => {
    //first find if the email is taken
    User.find({email: req.body.email})
    .exec()
    .then(user =>{
        
        //if a user exists, return (exit) info to user
        if(user.length>=1){
            return res.status(422).json({
                message: "The email used is taken"
            });
        } else {
            bcrypt.hash(req.body.email, 10, (err, hash)=>{
                //create a new user
                const user = new User({
                    _id: new mongoose.Types.ObjectId(),
                    email: req.body.email,
                    password: hash
                });

                //save the user
                user
                .save()
                .then(result =>{
                    console.log(result);
                    res.status(201).json({
                        message:"User created"
                    });
                })
                .catch(err=>{
                    console.log(err);

                    res.status(500).json({
                        error:err
                    });
                });
            })
        }
    })
    
});



//create the log in route
router.post('/login', (req, res, next) => {
    User.findOne({email:req.body.email})
    .exec()
    .then(user =>{
        //console the results
        console.log(user);
        console.log(user.password);
        if(!user){
            return res.status(401).json({
                message:"Auth failed"
            });
        }
        console.log("pass check 1");
        //if you use user.findOne, the results are not in an array and you can simply 
        //use user.password? -- console.log to find out
        bcrypt.compare(req.body.password, user.password, (err, result)=>{
            //this is returned whten the compare method returns an error for whatever reason
            console.log("I am here...");
            console.log(result);
            console.log(err);
            if(err){
                return res.status(401).json({
                    message:"Auth failed"
                });
            }

            if(!result){
                return res.status(200).json({
                    message: "Auth successful"
                });
            }
            //this is returned when the password is incorrect
            res.status(401).json({
                message:"Auth failed --wrong password"
            });
        });

        //
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
  });

router.delete("/:userId", (req, res, next) => {
    User.remove({_id: req.params.userId})
    .exec()
    .then(results =>{

        res.status(200).json({
            message: "The user has been deleted",

            request:{                
                type: "POST",
                link: 'http://localhost:3000/user/signup',
                data: {email: "String", password: "String"}
            }
        });
    })
    .catch(err =>{
        res.status(500).json({
            error:err
        });
    });
});
module.exports = router;