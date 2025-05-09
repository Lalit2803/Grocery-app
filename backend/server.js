const express =require ("express");
const { PORT } = require("./config");
const cookieParser = require("cookie-parser");
const cors=require("cors");
const { error } = require("./middlewares/error.middleware");
const { connectDB } = require("./config/db");
const userRoutes=require("./routes/User.routes");
const sellerRoutes=require("./routes/seller.routes")
const productRoutes=require("./routes/produc.routes")

const addressRoutes=require("./routes/address.routes")

const cartRoutes=require("./routes/cart.routes")
const orderRoutes=require("./routes/order.routes");
const { stripeWebhook } = require("./controllers/order.controller");
connectDB();
const app=express();
//allowed multiple origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://grocery-app-frontend-pb47.onrender.com", // <-- your deployed frontend domain
];

app.post('/stripe',express.raw({type:'application/json'},stripeWebhook))

// middleware configuration

app.use(express.json());
app.use(cookieParser());

// use function for dynamic CORS
app.use(cors({
  origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
      } else {
          callback(new Error("Not allowed by CORS"));
      }
  },
  credentials: true,
}));
app.use("/lps/user",userRoutes)
app.use("/lps/seller",sellerRoutes)
app.use("/lps/products",productRoutes)
app.use("/lps/cart",cartRoutes)
app.use("/lps/address",addressRoutes)
app.use("/lps/order",orderRoutes)

app.get("/", (req, res) => {
  res.send("🚀 Grocery API is working!");
});

app.use(error)
app.listen(PORT,(err)=>{
    if(err) throw err;
    console.log(`Port is listening at ${PORT}`)
})