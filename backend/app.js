import express from 'express'
import productRoutes from './routes/productRoutes.js'
import errorHandlerMiddleware from './middleware/error.js'
import userRoutes from './routes/userRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import cookieParser from 'cookie-parser'
import fileUpload from 'express-fileupload'
const app = express();

//Middleware
app.use(express.json({ limit: '50mb' }))
app.use(cookieParser())
app.use(fileUpload())
//Route
app.use("/api/v1", productRoutes)
app.use("/api/v1", userRoutes)
app.use("/api/v1", orderRoutes)



app.use(errorHandlerMiddleware)
export default app;

