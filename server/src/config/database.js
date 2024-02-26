import mongoose from "mongoose";

mongoose.set("strictQuery",false)

const connectToDb= async ()=>{
    try {
        const response=await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`);
        console.log(`MONGODB CONNECTED !! DB HOST: ${response.connection.host}`)        
    } catch (error) {
        console.log("MONGODB CONNECTION FAILED !!",error);
        process.exit(1);
    }
}
export default connectToDb;