const router = require("express").Router();
const eventModel = require("../models/eventModel");
const userModel = require("../models/userModel")

// add new event
router.post("/create-event", async (req, res) => {
    try {
        const { usernames, eventTimezone, startTime, endTime } = req.body;
        if (new Date(endTime) < new Date(startTime)) {
            return res.status(400).send({
                success: false,
                message: "End time must be after the start time !",
            })
        }
        const newEvent = new eventModel({
            usernames, eventTimezone, startTime, endTime, logs: [],
        })
        await newEvent.save();
        return res.status(200).send({
            success: true,
            message: "Event created successfuly",
            data: newEvent,
        })
    } catch (err) {
        return res.status(404).send({
            success: false,
            message: "Error while creating event",
            error: err.message
        })
    }
});

// update the event
router.put("/update-event/:id", async (req, res) => {
    try {
        const eventId = req.params.id;
        const updateData = req.body;
        const event = await eventModel.findById(eventId);
        if (!event) {
            return res.status(404).send({
                success: false,
                message: "Event does not exist!"
            })
        }
        const previous = event.toObject(); // storing the previous values to compare and update log

        Object.keys(updateData).forEach(key => {
            event[key] = updateData[key];
        });
        const changes = {};
        for (const key in updateData) {
            if (key == "changedBy") continue;
            else if (JSON.stringify(updateData[key]) !== JSON.stringify(previous[key])) {
                changes[key] = { old: previous[key], new: updateData[key] };
            }
        }
        if (Object.keys(changes).length > 0) {
            event.logs.push({
                changedBy: updateData.changedBy || "default",
                changes,
                timestamp: new Date(),
            })
        }
        await event.save();
        return res.status(200).send({
            success: true,
            message: "Event Update successful",
            data: event,
        });
    } catch (err) {
        return res.status(404).send({
            success: false,
            message: "Error while updating event",
            error: err.message
        })
    }
})

// get events of the particular user
router.get("/get-userevents/:id", async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await userModel.findById(userId);
        if(!user){
            return res.status(400).send({
                success:false,
                message:"User not found"
            })
        }
        const events = await eventModel.find({ usernames: user.name }).sort({ startTime: 1 }).lean();
        if(events.length === 0){
            return res.status(200).send({
                success:true,
                message: "There is no events for the user"
            })
        }

        return res.status(200).send({
            success:true,
            message:"All events fetched for the current user",
            data:events
        })
    } catch (err) {
        return res.status(404).send({
            success: false,
            message: "Error while fetching the events",
            error: err.message
        })
    }
})

// get logs of the particular event
router.get("/get-eventlogs/:id", async (req, res) => {
    try {
        const eventId = req.params.id;
        const event = await eventModel.findById(eventId);
        if(!event){
            return res.status(400).send({
                success:false,
                message:"Event does not exist",
            })
        }
        return res.status(200).send({
            success:true,
            message:"Event Logs fetched successfuly",
            data:event.logs
        })

    } catch (err) {
        return res.status(404).send({
            success: false,
            message: "Error while creating event",
            error: err.message
        })
    }
})

module.exports = router;