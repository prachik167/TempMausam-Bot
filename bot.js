require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const mongoose = require('mongoose');
const axios = require('axios');
const schedule = require('node-schedule');

// Load environment variables
const token = process.env.TELEGRAM_TOKEN;
const weatherApiKey = process.env.OPENWEATHER_API_KEY;
const mongoUri = process.env.MONGO_URI;

// Connect to MongoDB
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB for Telegram Bot'))
    .catch((err) => console.error('Error connecting to MongoDB:', err));

// User Schema
const userSchema = new mongoose.Schema({
    chatId: { type: String, required: true, unique: true },
    firstName: String,
    subscribed: { type: Boolean, default: false },
    blocked: { type: Boolean, default: false }
});
const User = mongoose.model('User', userSchema);

// Initialize Telegram bot
const bot = new TelegramBot(token, { polling: true });

// Start command
bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;

    try {
        const user = await User.findOneAndUpdate(
            { chatId },
            { firstName: msg.from.first_name },
            { upsert: true, new: true }
        );
        bot.sendMessage(chatId, `Hello ${msg.from.first_name}! 👋\n\nI am your Weather Bot. 🌤️\nHere are my commands:\n- /subscribe: Subscribe to daily weather updates\n- /unsubscribe: Unsubscribe from updates\n- /weather <city>: Get current weather of a city`);
    } catch (err) {
        console.error('Error saving user:', err);
        bot.sendMessage(chatId, '⚠️ Unable to start. Please try again later.');
    }
});

// Subscribe command
bot.onText(/\/subscribe/, async (msg) => {
    const chatId = msg.chat.id;

    try {
        const user = await User.findOne({ chatId });
        if (user && user.blocked) {
            bot.sendMessage(chatId, "🚫 You are blocked and cannot subscribe.");
            return;
        }

        await User.findOneAndUpdate(
            { chatId },
            { subscribed: true },
            { new: true }
        );
        bot.sendMessage(chatId, "✅ You have subscribed to daily weather updates!");
    } catch (err) {
        console.error('Error subscribing user:', err);
        bot.sendMessage(chatId, '⚠️ Unable to subscribe. Please try again later.');
    }
});

// Unsubscribe command
bot.onText(/\/unsubscribe/, async (msg) => {
    const chatId = msg.chat.id;

    try {
        const user = await User.findOne({ chatId });
        if (user && user.blocked) {
            bot.sendMessage(chatId, "🚫 You are blocked and cannot unsubscribe.");
            return;
        }

        await User.findOneAndUpdate(
            { chatId },
            { subscribed: false },
            { new: true }
        );
        bot.sendMessage(chatId, "❌ You have unsubscribed from daily weather updates.");
    } catch (err) {
        console.error('Error unsubscribing user:', err);
        bot.sendMessage(chatId, '⚠️ Unable to unsubscribe. Please try again later.');
    }
});

// Weather command
bot.onText(/\/weather (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const city = match[1];

    try {
        const user = await User.findOne({ chatId });
        if (user && user.blocked) {
            bot.sendMessage(chatId, "🚫 You are blocked and cannot request weather updates.");
            return;
        }

        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiKey}&units=metric`;
        const response = await axios.get(weatherUrl);
        const weatherData = response.data;

        const message = `
🌍 Weather in ${weatherData.name}, ${weatherData.sys.country}:
- 🌡️ Temperature: ${weatherData.main.temp}°C
- 🌥️ Weather: ${weatherData.weather[0].description}
- 💧 Humidity: ${weatherData.main.humidity}%
- 🌬️ Wind Speed: ${weatherData.wind.speed} m/s
        `;
        bot.sendMessage(chatId, message);
    } catch (err) {
        console.error('Error fetching weather:', err);
        bot.sendMessage(chatId, "⚠️ Unable to fetch weather data. Please check the city name and try again.");
    }
});

// Send daily updates to subscribed users
const sendDailyUpdates = async () => {
    const city = "New York"; // Default city for daily updates
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiKey}&units=metric`;

    try {
        const response = await axios.get(weatherUrl);
        const weatherData = response.data;
        const message = `
🌤️ Daily Weather Update for ${weatherData.name}:
- 🌡️ Temperature: ${weatherData.main.temp}°C
- 🌥️ Weather: ${weatherData.weather[0].description}
- 💧 Humidity: ${weatherData.main.humidity}%
- 🌬️ Wind Speed: ${weatherData.wind.speed} m/s
        `;

        const subscribedUsers = await User.find({ subscribed: true, blocked: false });
        subscribedUsers.forEach((user) => {
            bot.sendMessage(user.chatId, message);
        });
    } catch (err) {
        console.error('Error sending daily updates:', err);
    }
};

// Schedule daily updates at 8 AM
schedule.scheduleJob('0 8 * * *', sendDailyUpdates);

console.log("Telegram bot is running...");


