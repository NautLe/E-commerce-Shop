import dotenv from 'dotenv'
import path from 'path'

if (process.env.NODE_ENV !== 'PRODUCTION') {
    dotenv.config({
        path: path.resolve(process.cwd(), 'backend/config/config.env')
    })
}

if (!process.env.STRIPE_SECRET_KEY) {
    dotenv.config({
        path: path.resolve(process.cwd(), 'config/config.env')
    })
}

import { connectToDB } from './config/connectToDB.js';
import { v2 as cloudinary } from 'cloudinary'
const { default: app } = await import('./app.js');

connectToDB();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})

// Handle Uncaught Exception
process.on("uncaughtException", (err) =>{
    console.log(`Error: ${err.message}`);
    console.log("Shutting down the server due to Uncaught Exception");
    process.exit(1);
})
const port = process.env.PORT || 3000;


const server = app.listen(port, () => {
    console.log(`Server is running on PORT ${port}`)
})

process.on("unhandledRejection", (err) => {
    console.log(`Error: ${err.message}`);
    console.log("Shutting down the server due to Unhandled Promise Rejection");
    server.close(() => {
        process.exit(1);
    })
})
