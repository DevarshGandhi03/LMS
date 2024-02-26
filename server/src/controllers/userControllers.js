import apiError from "../utils/apiError.js";
import { User } from "../models/userModel.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

async function generateRefreshToken(userId) {
  const user = await User.findById(userId);
  const refreshToken = user.generateRefreshToken();
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });
  return refreshToken;
}

const register = async (req, res, next) => {
  const { username, email, password, fullName } = req.body;

  if (!(username && password && email && fullName)) {
    return next(new apiError("All fields are required", 400));
  }
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new apiError(409, "User with email or username already exists");
  }

  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    return next(new apiError(401, "Avatar local file path not found"));
  }

  const response = await uploadOnCloudinary(avatarLocalPath);

  if (!response) {
    return next(new apiError(401, "Profile image url not found"));
  }

  const user = await User.create({
    username,
    fullName,
    email,
    password,
    avatar: {
      secure_url: response.url,
    },
  });
  const createdUser = await User.findById(user.id).select(
    "-password -refreshToken"
  );
  if (!user) {
    return next(
      new apiError(401, "User registration failed !! Please try again !!")
    );
  }

  res.status(201).json({
    message: "User created successfully",
    data: createdUser,
  });
};

const login = async (req, res,next) => {
  const { username, email, password } = req.body;

  if (!(username || email)) {
    return next(new apiError(401, "Username or email required !!"));
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    return next(new apiError(401, "User does not exixt !"));
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    return next(
      new apiError(401, "Incorrect password entered, please try again!")
    );
  }

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  const refreshToken = await generateRefreshToken(user._id);

  return res
    .status(200).cookie("refreshToken", refreshToken, {
      httpOnly: true
    }).json({
      message: "User logged in successfully",
      success: true,
      userData: createdUser,
    })
};

const logout = async (req, res) => {

  await User.findByIdAndUpdate(req.user._id,
    {
      $unset:{refreshToken:1}
    },
    {
      new:true
    }
  )

  res.status(200).clearCookie("refreshToken",{httpOnly:true,secure:true,maxAge: 0}).json({
    message:"User logged out successfully !!",
    success:true,

  
  });

};

const getUser = async (req, res) => {
  res.status(201).json({
    message: "User found !",
    success:true,
    data:await User.findById(req.user._id).select("-password -refreshToken")
  })
};

export { register, login, logout, getUser };
