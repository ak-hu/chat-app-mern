const mongoose = require('mongoose');

//creating new model in database for users
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        min: 4,
        max: 20,
        unique: true,

    },
    email: {
        type: String,
        required: true,
        max: 50,
        unique: true,

    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 30,
    },
    profilePic: {
        type: String,
    },
});

module.exports = mongoose.model("User", userSchema);