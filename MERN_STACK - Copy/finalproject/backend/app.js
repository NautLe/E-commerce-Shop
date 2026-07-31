  import express from 'express'
  import session from 'express-session'
  import MongoStore from 'connect-mongo'
  import productRoutes from './routes/productRoutes.js'
  import errorHandlerMiddleware from './middleware/error.js'
  import userRoutes from './routes/userRoutes.js'
  import orderRoutes from './routes/orderRoutes.js'
  import cookieParser from 'cookie-parser'
  import fileUpload from 'express-fileupload'
  import paymentRoute from './routes/paymentRoutes.js'
  import cartRoutes from './routes/cartRoutes.js'
  import couponRoutes from './routes/couponRoutes.js'
  import { stripeWebhook } from './controller/webhookController.js'
  import cors from 'cors'
  import path from 'path'
  import { fileURLToPath} from 'url'
  const app = express();

  const __filename= fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)

  app.use(cors({
    origin: 'http://localhost:5173',
    credentials : true
  }))
  app.post(
    "/api/v1/payment/webhook",
    express.raw({ type: "application/json" }),
    stripeWebhook
  )

  //Middleware
  app.use(express.json({ limit: '50mb' }))
  app.use(cookieParser())
  app.use(fileUpload({
      limits: { 
          fileSize: 50 * 1024 * 1024,  
          fieldSize: 50 * 1024 * 1024  
      }
  }))

  app.use(session({
    secret: process.env.SESSION_SECRET, 
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.DB_URL,
      ttl: 14 * 24 * 60 * 60 // set 14 days for session
    }),
    cookie: {
      maxAge: 14 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: 'lax'
    }
  }))

  //Route
  app.use("/api/v1", productRoutes)
  app.use("/api/v1", userRoutes)
  app.use("/api/v1", orderRoutes)
  app.use("/api/v1", cartRoutes)
  app.use("/api/v1", paymentRoute)
  app.use("/api/v1", couponRoutes)

  app.use(errorHandlerMiddleware)

  // server static file
  app.use(express.static(path.join(__dirname,'../frontend/dist')))
  app.all("/*splat", (req, res) => {
res.send("Not Found");
});
  export default app;

