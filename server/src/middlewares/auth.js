import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";
import apiError from "../utils/apiError.js";

const verifyUser = async (req, res, next) => {
  try {
    const refreshToken =
      req.cookies?.refreshToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    if (!refreshToken) {
      return next(new apiError("User authentication failed !!", 401));
    }

    const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findById(payload._id);
    if (!user) {
      return next(new apiError("User not found !!"), 401);
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    return next(
      new apiError("User authentication failed is catch block!!", 400)
    );
  }
};

export default verifyUser;
