import { sendLogs } from "./transport.js";

export class Logger {
  constructor(options) {
    this.service = options.service;
    this.apiKey = options.apiKey;
    this.endpoint = options.endpoint;

    this.buffer = [];
    this.batchSize = 20;
    this.flushInterval = 2000;
    this.flushing = false;

    setInterval(() => this.flush(), this.flushInterval);

    // graceful shutdown flush (Node.js)
    if (typeof process !== "undefined") {
      const shutdown = async () => {
        try {
          await this.flush();
        } catch (e) {}
      };

      process.on("beforeExit", shutdown);
      process.on("SIGINT", async () => {
        await shutdown();
        process.exit(0);
      });
      process.on("SIGTERM", async () => {
        await shutdown();
        process.exit(0);
      });
    }
  }

  log(level, message, metadata = {}) {
    const log = {
      level,
      message,
      metadata,
      service: this.service,
      timestamp: Date.now()
    };

    this.buffer.push(log);

    if (this.buffer.length >= this.batchSize) {
      this.flush();
    }
  }

  info(message, metadata) {
    this.log("info", message, metadata);
  }

  warn(message, metadata) {
    this.log("warn", message, metadata);
  }

  error(message, metadata) {
    this.log("error", message, metadata);
  }

  debug(message, metadata) {
    this.log("debug", message, metadata);
  }

  async flush() {
    if (this.flushing) return;
    if (this.buffer.length === 0) return;

    this.flushing = true;

    const logs = this.buffer.splice(0, this.batchSize);

    try {
      await sendLogs(this.endpoint, this.apiKey, logs);
    } finally {
      this.flushing = false;
    }
  }
}