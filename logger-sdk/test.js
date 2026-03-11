import { Logger } from "./src/index.js";

const logger = new Logger({
  service: "test-123-abc",
  apiKey: "f05c5a873ab68e7bcf31b92ce0afed4cc5d56ffc289e0900",
  endpoint: "http://localhost:4000"
});

let counter = 0;

console.log("🚀 Logger test started... Sending logs every second\n");

setInterval(() => {
  counter++;

  const logData = {
    userId: 42,
    attempt: counter,
    action: "login",
    ip: "192.168.1.15",
    device: "MacBook Pro",
    browser: "Chrome",
    location: {
      country: "India",
      city: "Gurgaon"
    },
    requestId: `req-${counter}`,
    sessionId: "sess-98af12"
  };

  console.log(`📝 Sending log #${counter}`, logData);

  logger.info("User login attempt", logData);

  if (counter % 5 === 0) {
    console.log("⚠️ Simulating warning log");
    logger.warn("Multiple login attempts sweetheart", {
      attempt: counter,
      threshold: 5,
      ip: "192.168.1.15",
      riskLevel: "medium"
    });
  }

  if (counter % 10 === 0) {
    console.log("❌ Simulating error log");
    logger.error("Too Happy", {
      attempt: counter,
      threshold: 10,
      ip: "192.168.1.15",
      accountLocked: true,
      securityAction: "temporary_lock"
    });
  }

}, 1000);