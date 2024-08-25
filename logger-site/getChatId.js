const axios = require("axios");
require("dotenv").config();

// Replace with your Telegram bot token
const token = process.env.TELEGRAM_TOKEN;
const url = `https://api.telegram.org/bot${token}/getUpdates`;

const getChatId = async () => {
  try {
    // Send a GET request to the Telegram API using axios
    const response = await axios.get(url);

    // Check if the response was successful
    if (response.data.ok) {
      console.log("Updates:", response.data.result);
      console.log("Updates:", response.data.result[0].message.chat);

      // Look for the chat ID in the printed result
    } else {
      console.error("Error fetching updates:", response.data.description);
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

getChatId();
