const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    apiKey: String,
});

module.exports = mongoose.model('Settings', settingsSchema);
