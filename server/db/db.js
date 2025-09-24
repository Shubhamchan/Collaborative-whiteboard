import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config();

export default async function ConnectionDB(){
    try{
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("Connected to DB successfully")
    }
    catch(error){
        console.log("error occur while connection with db",error.message)
        process.exit(1)
    }

}