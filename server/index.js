const express = require ("express")
const app = express();
const dbconfig = require("./config/dbconfig")
const userRoute = require("./routes/userRoutes");
const eventRoute = require("./routes/eventRoutes");

const cors = require("cors")
app.use(cors({origin:"*"})); // allowing all origins for now

app.use(express.json()); // converting the response to json

app.use('/api/users', userRoute);
app.use('/api/events', eventRoute);

app.listen("8000", ()=>{
    console.log("Server started on port 8000")
})