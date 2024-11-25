# TempMausam-Bot
TempMausam_Bot is a Telegram bot that provides weather updates for any city. It also includes an admin panel to manage users, allowing actions like blocking, unblocking, and deleting users.
The bot is live and accessible on Telegram via @tempmausam_bot.

<h3>Features</h3>

**Telegram Bot**
-start bot using /start command
-Get real-time weather updates for any city using /weather <city> command.
-Subscribe to daily weather updates using /subscribe.
-Unsubscribe from updates using /unsubscribe.

**Admin Panel**
-View all users, including their subscription and blocked statuses.
-Block or unblock users.
-Delete users from the system.
-Update API keys for weather services directly from the admin panel.

<h2>Prerequisites</h2>
Before running the bot, ensure you have the following installed:
-Node.js (v16 or higher)
-MongoDB

<h2>Installation</h2>
1. Clone the Repository
```bash
-git clone https://github.com/prachik167/TempMausam-Bot.git

-cd TempMausam-Bot

2. Install dependencies:
-npm install

3. Run the project concurrently (both bot and admin panel):
-npm install -g concurrently

<h2>Run Instructions</h2>
1.After installing npm install -g concurrently ,to run both admin panel and bot , Use command
- npm start
2.The admin panel will be accessible at http://localhost:5000

<h2>Bot Commands</h2>

| **Command**       | **Description**                                           |
|--------------------|----------------------------------------------------------|
| **/start**        | **Greet the user and show available commands.**           |
| **/weather**      | **Get current weather updates for a specified city.**     |
| **/subscribe**    | **Subscribe to daily weather updates.**                   |
| **/unsubscribe**  | **Unsubscribe from daily weather updates.**               |

<h2>Technologies Used</h2>

**Frontend**: HTML, CSS, JavaScript
**Backend**: Node.js, Express.js
**Database**: MongoDB
**Telegram Bot** API:node-telegram-bot-api
**Weather API**: Data sourced from OpenWeatherMap

<h2>Screenshots</h2>
<h4>Admin Panel</h4>
![Screenshot (390)](https://github.com/user-attachments/assets/e761cc25-3d6c-4bc9-b77b-b40a841d8462)

<h4>Telegram Bot</h4>
![Screenshot (391)](https://github.com/user-attachments/assets/e21d6a8a-e935-4f1f-867c-22b807b5752d)
