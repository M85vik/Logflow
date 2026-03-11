import dotenv from "dotenv"
dotenv.config()
import { redis } from "./redis.js";
import { connectDB } from "./db.js";
import { processLog } from "./logProcessor.js";
import os from "os";
import express from "express";
const STREAM = "logs-stream";
const GROUP = "log-workers";

const CONSUMER = `${os.hostname()}-${process.pid}`;

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());

// Health endpoint for uptime ping
app.get("/", (req, res) => {
  res.send("log-worker alive");
});

app.get("/health", (req, res) => {
  res.json({ status: "ok", worker: CONSUMER });
});

app.listen(PORT, () => {
  console.log(`Worker ping server running on port ${PORT}`);
});

const ensureStreamGroup = async () => {
  try {
   await redis.xgroup(
  "CREATE",
  STREAM,
  GROUP,
  "$",
  "MKSTREAM"
);
    console.log("Consumer group created");
  } catch (err) {
    if (err.message.includes("BUSYGROUP")) {
      console.log("Consumer group already exists");
    } else {
      throw err;
    }
  }
};


const start = async () => {
  await connectDB();
    await ensureStreamGroup();
  console.log("Worker started");

 while (true) {
  try {
    const response = await redis.xreadgroup(
      "GROUP",
      GROUP,
      CONSUMER,
      "BLOCK",
      5000,
      "COUNT",
      10,
      "STREAMS",
      STREAM,
      ">"
    );

    if (!response) continue;

    const [stream, messages] = response[0];

    for (const message of messages) {
      const [id, fields] = message;

      const data = {};

     for (let i = 0; i < fields.length; i += 2) {
  const key = fields[i];
  let value = fields[i + 1];

  if (key === "metadata") {
    try {
      value = JSON.parse(value);
    } catch {}
  }

  data[key] = value;
}

      try {
        await processLog(data);
        await redis.xack(STREAM, GROUP, id);
      } catch (err) {
        console.error("Failed to process log", err);
      }
    }

  } catch (err) {
    console.error("Worker error:", err);
  }
}
};

start();

