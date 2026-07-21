import express from 'express'
import productRoutes from './routes/productRoutes.js'
import errorHandlerMiddleware from './middleware/error.js'
import userRoutes from './routes/userRoutes.js'
import cookieParser from 'cookie-parser'
const app = express();

//Middleware
app.use(express.json())
app.use(cookieParser())
//Route
app.use("/api/v1", productRoutes)
app.use("/api/v1", userRoutes)


app.use(errorHandlerMiddleware)
export default app;

