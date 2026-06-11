require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const HoldingsModel = require("./Model/HoldingModel");
const PositionModel = require("./Model/PositionModel");
const OrdersModel = require("./Model/OrderModel");
const  {asyncHandler} = require( "./utils/asyncHandler.js");
const {ApiError} =require( "./utils/ApiError.js");
const {ApiResponse} =require( "./utils/apiResponse.js");
const {User} =require( "./Model/UserModel");
const bcrypt =require( "bcryptjs");
const jwt = require("jsonwebtoken");
// import jwt from "jsonwebtoken";
const cookieParser = require("cookie-parser");
const { verifyJWT } = require("./middleware/auth");

const crypto = require("crypto");
const { Payment } = require("./Model/PaymentModels");
const Razorpay = require("razorpay");

const PORT = process.env.PORT || 8000;
const MONGO_URL = process.env.MONGO_URL;

const app = express();


// Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(cookieParser());

const generateAccessandRefereshToken = async (userId) => {
    try {
        const user = await User.findById(userId);

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;

        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };

    } catch (error) {
        console.log(error);
        throw new ApiError(
            500,
            "Something went wrong while generating tokens"
        );
    }
};








app.get("/",(req,res)=>{
    res.send("Hello World")
})

app.get("/allHoldings", async (req, res) => {
  let allHoldings = await HoldingsModel.find({});
  res.json(allHoldings);
});

app.get("/allPositions", async (req, res) => {
  let allPositions = await PositionModel.find({});
  res.json(allPositions);
});

// app.post("/newOrder", async (req, res) => {
//   let newOrder = new OrdersModel({
//     name: req.body.name,
//     qty: req.body.qty,
//     price: req.body.price,
//     mode: req.body.mode,
//   });

//   newOrder.save();

//   res.send("Order saved!");
// });



app.post("/register", asyncHandler(async (req, res) => {
    console.log(req.body);
    
    const { fullName, email, username, password } = req.body; 

    // Validation - not empty
    if ([fullName, email, username, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    // Check if user already exists
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists");
    }

    // Create user object in DB
    const user = await User.create({
        fullName,
        email, 
        password,
        username: username.toLowerCase()
    });

    // Remove password and token fields from the returned document
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    // FIX: Match frontend checking structure by ensuring response root has success: true 
    return res.status(201).json({
        success: true,
        statusCode: 200,
        data: {
            user: createdUser
        },
        message: "User registered Successfully"
    });
}));

app.post("/login", asyncHandler(async (req, res) => {
    // get login details
    console.log(req.body)
    console.log("hello nit")
// get login details
         const { usernameOrEmail, password } = req.body;
// validate login details
      if(!usernameOrEmail || !password) 
        {
        throw new ApiError(400, "Email or username is required")
      }

      // check for user existence
       const user = await User.findOne({
        $or: [
            { email: usernameOrEmail },
            { username: usernameOrEmail }
        ]
    });
      if (!user) {
        throw new ApiError(404, "User not found")
      }

        // compare password
        const isPasswordMatch = await user.isPasswordCorrect(password) // compare password is a method we created in user model to compare the password entered by user with the hashed password stored in database
        if (!isPasswordMatch) {
            throw new ApiError(401, "Invalid user credentials")
        }

        // generate token and refresh token
         const {accessToken, refreshToken}=await generateAccessandRefereshToken(user._id);
// update user
const loginUser=await User.findById(user._id).select("-password -refreshToken");
//  send to cookies
const options={
    httpOnly: true,
    secure: true,
}

return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options)

.json(
    new ApiResponse(200, {user: loginUser, accessToken, refreshToken}, "User logged in successfully")
)

}))

      


app.post("/logout", verifyJWT, asyncHandler(async (req, res) => {
   
    await User.findByIdAndUpdate(req.user._id, { $set: { refreshToken: undefined} })

   const options={
    httpOnly: true,
    secure: true,
   }
   
   return res.status(200).clearCookie("accessToken", options).clearCookie("refreshToken", options).json(
    new ApiResponse(200, null, "User logged out successfully")
   )



}))

// payment roytes

 const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

app.post("/checkout", verifyJWT, async (req, res) => {
  const { price,name } = req.body;
  console.log(price,name)
  

  const options = {
    amount: Number(price * 100),
    currency: "INR",
    name:name,
  };

  const razorpayOrder = await instance.orders.create(options);

  // Create MongoDB Order
  const dbOrder = await Order.create({
    user: req.user._id,
    name: req.body.name,
    qty: req.body.qty,
    price: req.body.price,
    model: req.body.model,
  });

  res.status(200).json({
    success: true,
    order: razorpayOrder,
    dbOrderId: dbOrder._id,
  });
});

app.post("/payment-verification", verifyJWT, async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    dbOrderId,
  } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_APT_SECRET)
    .update(body)
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    // Find Order
    const order = await Order.findById(dbOrderId);

    // Create Payment
    const payment = await Payment.create({
      order: order._id,
      user: order.user,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    // Update Order
    order.payment = payment._id;
    order.status = "completed";

    await order.save();
  } else {
    res.status(400).json({
      success: false,
    });
  }
});

app.get("/api/getkey", (req, res) =>
  res.status(200).json({ key: process.env.RAZORPAY_API_KEY })
);

mongoose.connect(MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB Atlas successfully!");
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err);
  });

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});




