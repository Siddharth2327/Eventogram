const express = require("express");
const router = express.Router();
const userModel = require("../models/userModel");

router.post("/create-user", async (req, res) => {
    try {
        // first check if the user name already exists
        const userexists = await userModel.findOne({ name: req.body.name });
        if (userexists) {
            return res.status(400).send({
                success: false,
                message: "UserName already exists!"
            })
        }
        const newUser = await userModel(req.body);
        await newUser.save();
        return res.status(200).send({
            success: true,
            message: "User created successfully",
            data:newUser
        })
    } catch (err) {
        return res.status(404).send({
            success: false,
            message: "Error while creating user",
            error: err.message,
        })
    }

})

router.get("/get-all-users", async(req,res)=>{
    try{
        const users = await userModel.find();
        return res.status(200).send({
            success:true,
            message:"All users fetched",
            data:users
        })
    }catch(err){
        return res.status(404).send({
            success:false,
            message: "Error while getting all the users",
            error: err.message,
        })
    }
})
router.put("/update-user-timezone", async(req, res)=>{
    try{
        const {name, newTimezone} = req.body;
        const updatedUser = await userModel.findOneAndUpdate({name}, {timezone:newTimezone}, {new:true});
        if(!updatedUser){
            return res.status(400).send({
                success:false,
                message:"User does not exist!"
            })
        }
        return res.status(200).send({
            success:true,
            message:"TimeZone Updated",
            data:updatedUser,
        })
    }catch(err){
        return res.status(404).send({
            success:false,
            message:"Error while updating timezone",
            error:err.message
        })
    }
})
module.exports = router;