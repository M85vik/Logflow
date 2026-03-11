import mongoose from "mongoose";

const LogSchema = new mongoose.Schema(
  {
    level: {
      type: String,
      enum: ["debug", "info", "warn", "error"],
      required: true,
      index: true
    },
    message: {
      type: String,
      required: true
    },
    service: {
      type: String,
      required: true,
      index: true
    },
    apiKey: {
      type: String,
      required: true,
      index: true
    },
    requestId: {
      type: String,
      index: true
    },
    environment: {
      type: String,
      default: "production",
      index: true
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  {
    versionKey: false
  }
);

// LogSchema.index({ service: 1, level: 1, timestamp: -1 });

LogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 604800 });
export default mongoose.model("Log", LogSchema);