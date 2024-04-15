import  express  from "express"
import dotenv from "dotenv"
import morgan from "morgan";
import connectdb from "./config/db.js";
import authRoute from "./routes/authRoute.js"
import productRoute from "./routes/productRoute.js"
import cartRoute from "./routes/cartRoute.js"
import usersRoute from "./routes/usersRoute.js"
import { sendEmail,sendwelcomemail,sendOTP } from "./middlewares/nodemailerMiddleware.js";
import OrderRoutes from "./routes/orderRoute.js"
import cors from "cors"


dotenv.config();
const app = express()//express
connectdb();//Database


app.use(cors())
app.use(morgan("dev"))
app.use(express.json())

app.use("/api/v1/auth",authRoute)
app.use("/api/v1/product", productRoute);
app.use("/api/v1/users", usersRoute);
app.use("/api/v1/orders", OrderRoutes);  
app.use("/api/v1/cart", cartRoute);

app.post('/send-email', sendEmail);
app.post('/send-welcome-mail', sendwelcomemail);
app.post('/send-verification', sendOTP);

app.get("", (req, res) => {
    res.status(200).json({message:"Welcome to VISION"})
  });

const PORT = process.env.PORT || 3002
app.listen(PORT, () => {
    console.log('****Server Started on '+process.env. DEV_MODE +" Mode PORT:"+ PORT+"****")
})