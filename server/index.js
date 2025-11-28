require('dotenv').config(); // 

const express = require('express');
const path = require('path');
const cors = require('cors');

const connectDB = require('./config/dbconfig');
const userRoute = require('./routes/userRoutes');
const eventRoute = require('./routes/eventRoutes');

const app = express();

// Middlewares
app.use(express.json());
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
}));

// Connect to DB 
connectDB();

// API routes 
app.use('/api/users', userRoute);
app.use('/api/events', eventRoute);

// Serve client build, built after API routes for a static SPA fallback
const clientBuildPath = path.join(__dirname, '../client/vite-project/dist');
app.use(express.static(clientBuildPath));
app.use((req, res, next) => {
    // if the request is for the API, pass through
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(clientBuildPath, 'index.html'));
});


const PORT = Number(process.env.PORT) || 8000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});


