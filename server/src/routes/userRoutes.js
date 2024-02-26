import { Router } from "express";
import { logout ,login,register,getUser} from "../controllers/userControllers.js";
import {upload} from "../middlewares/multer.js"
import verifyUser from "../middlewares/auth.js";
const router = Router();

router.route("/register").post(upload.single("avatar"),register);
router.post("/login",upload.single("avatar"),login);
router.post("/getUser",verifyUser,getUser);
router.post("/logout",verifyUser,logout);

export default router;