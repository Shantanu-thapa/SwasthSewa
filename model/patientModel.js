const mongoose = require ("mongoose");

const patientSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
    },

    email:{
        type:String,
        required:true,
        trim:true,
    },

    password:{
        type:String,
        required:true,
        trim:true,
    },
},
     
    {
        timestamps:true,
    }
)

module.exports = mongoose.model("Patient", patientSchema);