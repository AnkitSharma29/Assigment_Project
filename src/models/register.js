const mongoose = require("mongoose");
const validator = require('validator');

//Schema
const RegisterSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true,
        minlength: 3
    },
    lname: {
        type: String,
        required: true,
        minlength: 3
    },
    email: {
        type: String,
        required: true,
        unique: [true, "Email is already present"],
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid Email");
            }
        }
    },
    password: {
        type: String,
        required: true,
    }
})

// we will create a new colleton
const Register = new mongoose.model('Assigment', RegisterSchema);

module.exports = Register;