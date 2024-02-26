import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: "dnt5vk7qk",
  api_key: "829142464445589",
  api_secret: "9-59_w_wh1U3ov9FoZ_jN-MAqQw",
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    console.log("reached");
    console.log(localFilePath);
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto"
  })
    console.log("reached");
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    return null;
  }
};

export default uploadOnCloudinary;
