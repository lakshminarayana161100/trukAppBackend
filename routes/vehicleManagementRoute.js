//first import the express
const express = require("express");
//define the router
 const router = express.Router();
//next mongoose is required
const mongoose = require("mongoose");
//express validator
const { body } = require('express-validator'); //use express validator for few required things

//import the schema here
const UserSignup = require('../models/userSignup');
const AddVehicle= require('../models/vehicleManagement');







//post vehicle goes here
router.post('/addVehicle',(req, res, next)=>{
    console.log("add vehicle function called")


    //call the schema
    const addVehicle=new AddVehicle({
        _id: new mongoose.Types.ObjectId,
        mobileNo: req.body.mobileNo,
        vehicles:req.body.vehicles,
        operatingRoutes:req.body.operatingRoutes

    })


     var  mobileNo = req.body.mobileno;
  //first check if user is alredy existed with the mobile no
  addVehicle.save().then(result=>{
    res.status(200).json({
        message:"added vehicle",
        status:"success",
        Id: result._id
    })
  }).catch(err=>{
      console.log(err);
      res.status(500).json({
        error: err
      })
  });
  
});


//get vehicle

 
router.get('/getVehicles/:mobileNo', (req, res, next)=>{

    AddVehicle.find({mobileNo:req.params.mobileNo}).exec().then(
         docs =>{
             res.status(200).json({
                        data: docs
                     })

             }).catch(err =>{
        res.status(500).json({
            error: err
        })
    });

})




    module.exports = router;