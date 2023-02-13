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
const AddVehicle= require('../models/vehicle');
const vehicle = require("../models/vehicle");
const { response } = require("../app");






router.post('/vehiclepost', async(req, res, next) => {        // want to create product details
    const vehicle = new AddVehicle({
        vehiclenumber: req.body.vehiclenumber,
        currentLocation: req.body.currentLocation,
        operatingRoutes: req.body.operatingRoutes,
        capacity: req.body.capacity,
        data: req.body.data,
        date:req.body.date,
        mobileNo:req.body.mobileNo


    });
    try {
        await vehicle.save()
        

        res.status(201).json({
            registeredVehicle: vehicle
        })
        
    } catch (error) {
        console.log(error)
        res.status(401).json(error)
    }

})
//get vehicles
router.get('/allVehicles', async (req, res) => {
    try {
        const Load = await AddVehicle.find()


        res.status(200).json({
            TotalProducts: Load.length,
            Load
        })
    } catch (error) {
        res.status(401).send(error)
    }
});

//filterByVehicle API 
router.get('/filterByVehicle/:data/:pickupLocation/:dropLocation', async (req, res) => {
    try {
        const vehicle = await AddVehicle.find({data:req.params.data, operatingRoutes: { $all: [req.params.pickupLocation, req.params.dropLocation]  }})
       
if(!vehicle){
    res.status(404).json({message:"Vehicle not fount"})
}

        res.status(200).json({
           
            vehicle
        })
    } catch (error) {
        res.status(401).send(error)
    }
});

// GetbymobileNo API

 router.get('/allVehicles/:mobileNo', (req, res, next)=>{

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


//update API

router.put('/updateLoads/:id', async (req, res) => {
    const updates = Object.keys(req.body) //keys will be stored in updates ==> req body fields
    const allowedUpdates = ['vehiclenumber', 'currentLocation','operatingRoutes','capacity','data','date','mobileNo'] // updates that are allowed
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update)) // validating the written key in req.body with the allowed updates
    if (!isValidOperation) {
        console.log(isValidOperation)
        return res.status(400).json({ error: 'invalid updates' })
    }
    try { // used to catch errors
        const product = await AddVehicle.findOne({ _id: req.params.id }) //finding the products based on id
        if (!product) {
            return res.status(404).json({ message: 'Invalid Product' }) //error status
        }
        updates.forEach((update) => product[update] = req.body[update]) //updating the value

        await product.save()
        res.status(400).json({
            updatedProduct: product
        })
    } catch (error) {
        res.status(400).json({ error })
    }
})
// deactive API
router.put('/TrukDeactive/:id', async (req, res) => {
    const updates = Object.keys(req.body) //keys will be stored in updates ==> req body fields
    const allowedUpdates = ['isActive'] // updates that are allowed
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update)) // validating the written key in req.body with the allowed updates
    if (!isValidOperation) {
        console.log(isValidOperation)
        return res.status(400).json({ error: 'invalid updates' })
    }
    try { // used to catch errors
        const product = await AddVehicle.findOne({ _id: req.params.id }) //finding the products based on id
        if (!product) {
            return res.status(404).json({ message: 'Invalid Product' }) //error status
        }
        updates.forEach((update) => product[update] = req.body[update]) //updating the value

        await product.save()
        res.status(400).json({
            updatedProduct: product
        })
    } catch (error) {
        res.status(400).json({ error })
    }
})

//delete API
router.delete('/deleteTruk/:_id' ,async(req,res)=> {
    try{
        const deletedProduct = await AddVehicle.findByIdAndDelete ( {_id:req.params._id} )
        if(!deletedProduct) {
            res.status(404).json({error: "Product not found"})

        }
        res.status(400).json({message: "Product Deleted",
        deletedProduct})
    } catch (error) {
        res.status(400).send (error)
    }
    
})
//Get the truk by isActive

router.get('/trukByStatus/:isActive',async(req,res)=>{
    try{
        const vehicle= await AddVehicle.find({isActive:req.params.isActive})
        if(!vehicle){
            res.status(404).send({error: "truks not found"})
        }
        res.status(400).json({
            TotalLoads:vehicle.length,
            vehicle})
    }catch(error){
        res.status(401).json({error})
        console.log(error)
    }
})

//show truks in truk market


// UserSignup.find({routes: { $all: ["Warangal", "delhi"] } } ).select().exec().then(doc =>{ 
//    console.log(doc.length)

// })


// vehicle search based on location
router.post('/vehicleSearch', async(req, res, next) => {   
   
    vehicle.find({operatingRoutes: { $all: [req.body.pickupLocation, req.body.dropLocation] } } ).select().exec().then(doc =>{ 
        console.log(doc.length)
     
        res.status(400).json({
           doc})
     })

})



module.exports= router