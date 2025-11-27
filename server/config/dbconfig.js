const mongoose = require('mongoose');
require("dotenv").config();
const dbstring = process.env.DBstring;
mongoose.connect(dbstring);
const connection = mongoose.connection;

connection.on('connected', ()=>{
    console.log("Connection to the database Success")
})
connection.on('error', ()=>{
    console.log("Connection to the database failed")
})