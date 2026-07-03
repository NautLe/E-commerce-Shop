import app from './app.js';
import dotenv from 'dotenv'
import { connectToDB } from './config/connectToDB.js';
dotenv.config({path: 'backend/config/config.env'})

connectToDB();

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
