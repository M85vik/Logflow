import express from "express"
import Log from "../models/logModel.js";
import { redis } from "../config/redis.js"
import {verifyApiKey} from "../middleware/verifyApiKey.js"
const router = express.Router();

router.post("/",verifyApiKey, async (req, res) => {
    const { logs } = req.body;
    const apiKey = req.project.apiKey;
    
    if (!logs || !Array.isArray(logs)) {
        return res.status(400).json({
            error: "Invalid Payload"
        })
    }


    for (const log of logs) {
        // await redis.xadd(
        //     "logs-stream",
        //     "*",
        //     "level",
        //     log.level,
        //     "message",
        //     log.message,
        //     "service",
        //     log.service,
        //     "timestamp",
        //     log.timestamp
        // );

   await redis.xadd(
  "logs-stream",
  "MAXLEN",
  "~",
  10000,
  "*",
  "level",
  log.level,
  "message",
  log.message,
  "service",
  log.service,
  "apiKey",
  apiKey,
  "timestamp",
  log.timestamp,
   "metadata",
  JSON.stringify(log.metadata || {})
);
    }

    res.json({ success: true });
})

router.get("/", async (req,res)=>{
     const logs = await Log.find()
    .sort({ timestamp: -1 })
    .limit(100);

  res.status(200).json(logs);
})

export default router