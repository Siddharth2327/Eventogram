const mongoose = require("mongoose");
const eventSchema = new mongoose.Schema({
    usernames:[{type:String, required:true}],
    eventTimezone:{
        type:String,
        required:true,
    },
    startTime:{
        type: Date,
        required:true
    },
    endTime:{
        type: Date,
        required:true
    },
    logs:[{
        changedBy:{type:String},
        changes:{type:Object},
        timestamp:{type:Date, default:Date.now}
    }]
})

const Event = mongoose.model("event", eventSchema);
module.exports = Event;