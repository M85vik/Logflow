
import  mongoose from "mongoose"

export  const connectDB = async ()=>{

    try {
        const MONGO_URI = process.env.MONGO_URI

        if(!MONGO_URI) throw new Error("Database environment variable not loaded")

        await mongoose.connect(process.env.MONGO_URI)

        console.log("DB Connected ");
        
    } catch (error) {
        console.error(`Database Error : ${error}`)
    }
}