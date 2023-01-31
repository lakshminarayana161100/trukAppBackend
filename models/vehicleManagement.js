

//get the reuired libraries
const mongoose= require("mongoose");

const vehicleObject={
    licencePlateNumber:{type: String, required: true},
    vehicleType:{type: String, required: true},
    vehicleCapacity:{type: Number, required: true}
}


//define the schema here
const vehicleManagementSchema = mongoose.Schema({
    //define the object ID
   _id: mongoose.Schema.Types.ObjectId,
   mobileNo: { type: Number, required: true },
   vehicles:[vehicleObject],
   operatingRoutes:{type: Array}
});


//export this mongoose module
module.exports = mongoose.model('vehicleManagement', vehicleManagementSchema);







