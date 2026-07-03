import express from 'express'
import productRoutes from './routes/productRoutes.js'
import errorHandlerMiddleware from './middleware/error.js'
const app = express();

//Middleware
app.use(express.json())
//Route
app.use("/api/v1", productRoutes)

app.use(errorHandlerMiddleware)
export default app;

