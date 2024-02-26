import app from "./app.js";
import 'dotenv/config';
import connectToDb from "./config/database.js";
const PORT= process.env.PORT;

connectToDb().then(()=>{
    app.listen(PORT,()=>{
        console.log("Server is running successfully on PORT:",PORT);
    })
    
}).catch((err)=>{
    console.log("Database connection failed !!",err);
})