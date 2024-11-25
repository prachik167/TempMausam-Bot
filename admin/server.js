require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

// Models
const User = require('./models/User');
const Settings = require('./models/Settings');

// Express app setup
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files (index.html)

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

// API to get all users
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching users' });
    }
});

// API to update API key in settings
app.post('/api/settings', async (req, res) => {
    try {
        const { apiKey } = req.body;
        const setting = await Settings.findOneAndUpdate({}, { apiKey }, { upsert: true, new: true });
        res.json({ message: 'API Key updated successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Error updating API key' });
    }
});

// API to block/unblock a user
app.patch('/api/users/:id', async (req, res) => {
    try {
        const { status } = req.body;
        const user = await User.findByIdAndUpdate(req.params.id, { blocked: status === 'blocked' }, { new: true });
        res.json({ message: `User ${status === 'blocked' ? 'blocked' : 'unblocked'} successfully` });
    } catch (err) {
        res.status(500).json({ error: 'Error updating user status' });
    }
});

// API to delete a user
app.delete('/api/users/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Error deleting user' });
    }
});

// Serve the index page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
