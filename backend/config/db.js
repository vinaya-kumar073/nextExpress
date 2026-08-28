import mongoose from "mongoose"

export const connectDB = async()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URI)

        console.log("Database connection successful")
    } catch (error) {
        console.log(error)
        console.error("Connection failed")
    }
}