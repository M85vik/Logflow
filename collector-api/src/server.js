import dotenv from 'dotenv';
dotenv.config();

import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js"

import logRoutes from "./routes/logs.js"
import projectRoutes from "./routes/project.js"
connectDB()

const app = express()
const PORT = process.env.PORT;
app.use(cors())
app.use(express.json())


app.get("/health", (req,res)=>{

    res.json({status:"OK"})

})

app.use("/logs", logRoutes)
app.use("/projects", projectRoutes)

app.listen(PORT, ()=>{
    console.log(`Logger Server running on port ${PORT}`);
    
})