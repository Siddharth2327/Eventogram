const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true // keeping the names unique to avoid confusion
    },
    timezone:{
        type:String,
        required:true, // saving the default time zone of the user
    }
}, {timestamps:true});
const User = mongoose.model("user", userSchema);
module.exports = User;