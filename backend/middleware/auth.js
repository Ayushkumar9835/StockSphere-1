



const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const { ApiError } = require("../utils/Apierror");
const { User } = require("../Model/UserModel");

module.exports.verifyJWT = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.headers?.authorization?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(401, "Unauthorized request");
  }

  const decodedToken = jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET
  );

  const user = await User.findById(decodedToken._id)
    .select("-password -refreshToken");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  req.user = user;
  next();
});