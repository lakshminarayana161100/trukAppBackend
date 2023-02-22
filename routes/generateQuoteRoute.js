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
router.post('/generateQuote', (req, res, next) => {
    console.log("generate quotes api is called")


    //find the agents avaibale in the given locations
    UserSignup.find({ routes: { $all: ["Warangal", "delhi"] } }).select().exec().then(doc => {
        console.log(doc.length)

        if (doc.length) { //if no provider available then throw error
            //get the list of peeple here loop throuh each doc and get the 
            var provider = []; //provider be an empty array first
            for (item of doc) {
                console.log(item.mobileNo);
                provider.push(item.mobileNo)
                console.log(provider)
            }

            //insert empty array of bids
            var bids;



             
        //use this when posting from truck market tab
        const truckMarketVehicleData={
            trukvehiclenumber:req.body.trukvehiclenumber,
            trukcurrentLocation:req.body.trukcurrentLocation,
            trukoperatingRoutes:req.body.trukoperatingRoutes,
            trukcapacity:req.body.trukcapacity,
            trukname:req.body.trukname,
            trukOwnerNumber:req.body.trukOwnerNumber
          }

            //get the details for the quote generating
            const quote = new quoteGenerate({
                _id: new mongoose.Types.ObjectId,
                OriginLocation: req.body.OriginLocation,
                Number: req.body.Number,
                DestinationLocation: req.body.DestinationLocation,
                product: req.body.product,
                Quantity: req.body.Quantity,
                state: req.body.state,
                data: req.body.data,
                expectedPrice: req.body.expectedPrice,
                date: req.body.date,
                typeOfPay: req.body.typeOfPay,
                length: req.body.length,
                breadth: req.body.breadth,
                height: req.body.height,
                comments: req.body.comments,
                quoteStatus: req.body.quoteStatus,
                quoteSentTo: provider,
                bids: bids,
                TruckMarketVehicle: truckMarketVehicleData
            });

            quote.save().then(result => {
                console.log(quote);
                //send mobile notification to every user in the array with their quote ID in notification
                res.status(200).json({
                    message: "quote generate and sent succeesfully",
                    status: "success",
                    Id: result._id
                });

            }).catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err,
                    status: "failed",
                    message: "failed to generateQuote"
                });
            })

        } else { //when no provider available
            res.status(200).json({
                status: "failed",
                message: "no providers available"
            })
        }

    })


});

//all Loads

router.get('/allQuotes', async (req, res) => {
    try {
        const quote = await quoteGenerate.find()


        res.status(200).json({

            Loads: quote
        })
    } catch (error) {
        res.status(401).send(error)
    }
});


function sendQuote(orgin, destination) {
    // userSignup.find()
    UserSignup.find({ routes: { $all: ["Warangal", "delhi"] } }).select().exec().then(doc => {
        console.log(doc)
    })


}




//add vehicle to load, its a post call
/***
 * find the laod by its ID and then attach the vehicle to it
 * 
 * 
 */
router.post('/attachVehicleToLoad', (req, res, next) => {

    //data needed for attaching load
    const vehicleData = {
        vehicleNo: req.body.vehicleNo,
        vehicleType: req.body.vehicleType,
        vehicleCurrentLocation: req.body.vehicleCurrentLocation,
        vehicleCapacity: req.body.vehicleCapacity,
        agentNo: req.body.agentNo,
        BidID: req.body.BidID,
        DriverName: req.body.DriverName,
        DriverNumber: req.body.DriverNumber,
        operatingRoutes: req.body.operatingRoutes,
        date: req.body.date,

    }


    //query find by the ID
    var query = { "_id": req.body._id };
    //form the query here
    var updateData = { $set: { vehicleInformation: vehicleData, isVehicleAttached: true } }  //$set for setting the variable value
    console.log(query)
    //find the docID or quote ID
    //  quoteGenerate.findOneAndUpdate(query, updateData).select().exec().then(
    quoteGenerate.findOneAndUpdate(query, updateData).select().exec().then(
        doc => {
            console.log(doc)
            //check if it has matching docs then send response
            if (doc) {
                res.status(200).json({
                    data: doc,
                    message: "attaching load to the vehicle",
                    status: "success"
                })
            } else {
                res.status(200).json({
                    message: "no vehicles attached",
                    status: "failed"
                })

            }
        }
    ).catch(err => {
        res.status(200).json({
            message: "failed to attach vehicle",
            status: "failed",
            error: err
        })
    })


})




//Add truck market vehicle to existing vehcile to existing Load and send notification to vehicle
router.post('/addTruckMarketVehicleToLoad', (req, res, next) => {




    var query = { _id: req.body._id };

    //data needed for truck Market vehicle
    const truckMarketVehicleData = {
        // TruckMarketVehicleNumber:req.body.TruckMarketVehicleNumber,
        // TruckMarketVehicleOwnerMobNumber:req.body.TruckMarketVehicleOwnerMobNumber,
        // TruckMarketVehicleType:req.body.TruckMarketVehicleType,
        // TruckMarketVehicleCapacity:req.body.TruckMarketVehicleCapacity,
        // TruckReeuestedPickupLocation:req.body.TruckReeuestedPickupLocation,
        // TruckRequestedDropOffLocation:req.body.TruckRequestedDropOffLocation


        trukvehiclenumber:req.body.trukvehiclenumber,
        trukcurrentLocation:req.body.trukcurrentLocation,
        trukoperatingRoutes:req.body.trukoperatingRoutes,
        trukcapacity:req.body.trukcapacity,
        trukname:req.body.trukname,
        trukmobileNo:req.body.trukmobileNo



    }

    var updateTruckMarketData = { $push: { TruckMarketVehicle: truckMarketVehicleData } }
    //get the load information query, get load by the ID and add the Vehicle to array. 
    quoteGenerate.findOneAndUpdate(query, updateTruckMarketData).select().exec().then(doc => {
        console.log(doc)
        res.status(200).json({
            message: doc
        })
    })



})




module.exports = router;