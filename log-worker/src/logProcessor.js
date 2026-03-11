import Log from "./models/logModel.js";

const BATCH_SIZE = 50;
const FLUSH_INTERVAL = 2000;

let buffer = [];

const flush = async () => {
  if (buffer.length === 0) return;

  const logs = buffer;
  buffer = [];

  try {
    await Log.insertMany(logs);
  } catch (err) {
    console.error("Batch insert failed:", err);
  }
};

setInterval(flush, FLUSH_INTERVAL);

export const processLog = async (data) => {
  const log = {
    level: data.level || "info",
    message: data.message || "unknown",
    service: data.service || "unknown",
    apiKey: data.apiKey || "unknown",
    requestId: data.requestId,
    timestamp: data.timestamp ? new Date(Number(data.timestamp)) : new Date(),
    metadata: data.metadata || {}
  };

  buffer.push(log);

  if (buffer.length >= BATCH_SIZE) {
    await flush();
  }
};