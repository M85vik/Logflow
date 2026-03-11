import dotenv from 'dotenv';
dotenv.config();

import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js"
import { redis } from "./config/redis.js"
import logRoutes from "./routes/logs.js"
import projectRoutes from "./routes/project.js"
connectDB()
redis.ping().then(console.log); 
const app = express()

app.use(cors())
app.use(express.json())


app.get("/health", (req,res)=>{

    res.json({status:"OK"})

})

app.use("/logs", logRoutes)
app.use("/projects", projectRoutes)

app.listen(4000, ()=>{
    console.log("Logger Server running on port 4000");
    
})