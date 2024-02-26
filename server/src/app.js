import express from "express";
import cors from "cors";
import morgan from "morgan"
import errorMiddleware from "./middlewares/errorMiddleware.js";
import bodyParser from "body-parser";
import cookieParser from 'cookie-parser';

const app = express();

// Middlewares
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:false}))
app.use(morgan("dev"))
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

// Routes
import userRoutes from "./routes/userRoutes.js";
app.use("/api/v1/user",userRoutes)

app.all("*",(req,res)=>{
    res.status(404).send("OOPS! Page not found ")
})
app.use(errorMiddleware);



export default app;