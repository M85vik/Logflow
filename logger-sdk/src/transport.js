import axios from "axios";

export const sendLogs = async (endpoint, apiKey, logs) => {
  try {
    await axios.post(
      `${endpoint}/logs`,
      { logs },
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey
        },
        timeout: 5000
      }
    );
  } catch (err) {
    console.error("Failed to send logs", err.message);
  }
};