const mongoose = require('mongoose');

const Vehicle = mongoose.Schema({

    vehiclenumber: {
        type: String,
        //require: true
    },
    currentLocation: {
        type: String,
        //required: true
    },
    operatingRoutes: {
        type: Array,
        //required: true
    },
    capacity: {
        type: String,
        //required: true
    },
    data: {
        type: String,
    },
    date: {
        type: String,
    },

    isActive:{
        type:String,
        default:"Active"
    },
    mobileNo:{
        type:String
    },
    pickupLocation:{
        type:String
    },
    dropLocation:{
        type:String
    }
})


module.exports = mongoose.model('vehicle', Vehicle)