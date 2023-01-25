//in this we will take the user from location and to location and create a algorithm to create a quote

// db.inventory.find( { areas: { $all: ["warangal", "delhi"] } } )


// db.inventory.insertMany([
//     { agent: "venkateshwara", qty: 4, areas: ["warangal", "bhupapally", "mahabubabad"], dim_cm: [ 14, 21 ] },
//     { agent: "mukta", qty: 5, areas: ["warangal", "bhupalpally","miryalaguda", "gandhinagar"], dim_cm: [ 14, 21 ] },
//     { agent: "crosser", qty: 10, areas: ["warangal", "bhupalpally","miryalaguda", "gandhinagar", "uppal", "vijayawada", "chennai"], dim_cm: [ 14, 21 ] },
//     { agent: "kalamani", qty: 8, areas: ["warangal", "bhupalpally","miryalaguda", "gandhinagar", "delhi"], dim_cm: [ 22.85, 30 ] },
//     { agent: "balaji", qty: 20, areas: ["warangal", "bhupalpally","miryalaguda", "gandhinagar", "delhi"], dim_cm: [ 10, 15.25 ] }
//  ]);

//first import the express
const express = require("express");
//define the router
 const router = express.Router();
//next mongoose is required
const mongoose = require("mongoose");
//express validator
const { body } = require('express-validator'); //use express validator for few required things

//import the schema here
const quoteGenerate = require('../models/generateQuote');
const { db } = require("../models/generateQuote");
const UserSignup = require("../models/userSignup");



//post method goes here
router.post('/generateQuote',(req, res, next)=>{
    console.log("generate quotes api is called")

   

     //find the agents avaibale in the given locations
     UserSignup.find({routes: { $all: ["Warangal", "delhi"] } } ).select().exec().then(doc =>{ 
        console.log(doc.length)
         
        if(doc.length){ //if no provider available then throw error
        //get the list of peeple here loop throuh each doc and get the 
        var provider=[]; //provider be an empty array first
        for(item of doc){
           console.log(item.mobileNo);
           provider.push(item.mobileNo)
           console.log(provider)
        }

       //get the details for the quote generating
       const quote = new quoteGenerate({
        _id: new mongoose.Types.ObjectId,
        pickupLocation:req.body.pickupLocation,
        userNumber:req.body.userNumber,
        dropLocation:req.body.dropLocation,
        goodsType:req.body.goodsType,
        quantity:req.body.quantity,
        vehicleType:req.body.vehicleType,
        loadCapacity:req.body.loadCapacity,
        expectedPrice:req.body.expectedPrice,
        dateRequired:req.body.dateRequired,
        quoteStatus:req.body.quoteStatus,
        quoteSentTo:provider
           });

           quote.save().then( result=> {
            console.log(quote);
            //send mobile notification to every user in the array with their quote ID in notification
            res.status(200).json({
               message: "quote generate and sent succeesfully",
               status:"success",
               Id: result._id
            });
  
        }).catch(err => {
         console.log(err);
            res.status(500).json({
             error: err,
             status:"failed",
             message:"failed to generateQuote"
              });
         })

        }else{ //when no provider available
            res.status(200).json({
                status:"failed",
                message:"no providers available"
            })
        }

})

    



});


function sendQuote(orgin, destination){
  // userSignup.find()
  UserSignup.find({routes: { $all: ["Warangal", "delhi"] } } ).select().exec().then(doc =>{ 
    console.log(doc)
  })

  
}
 



module.exports = router;