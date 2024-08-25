const axios = require("axios");
require("dotenv").config();

// Replace with your Telegram bot token
const token = process.env.TELEGRAM_TOKEN;
// Replace with your chat ID (can be a personal chat ID or a group chat ID)
const chatId = process.env.TELEGRAM_CHATID;

// Construct the URL to send a message
const url = `https://api.telegram.org/bot${token}/sendMessage`;

const sendMessage = async (message) => {
  if (message == "") {
    console.error("empty message");
  }
  try {
    // Send a POST request to the Telegram API
    const response = await axios.post(url, {
      chat_id: chatId,
      text: message,
    });

    // Check the response
    if (response.data.ok) {
      console.log("Message sent successfully");
    } else {
      console.error("Error sending message:", response.data.description);
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

module.exports = { sendMessage };
