const mongoose= require("mongoose");


const employeeSchema=new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },phone:{
        type: String,
        required: true
    },password:{
        type: String,
        required: true
    },confirmPassword:{
        type: String,
        required: true
    },
})
const Register= new mongoose.model("Register",employeeSchema);

module.exports= Register;