const express = require('express');
const Settings = require('../models/settings');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { apiKey } = req.body;
    let settings = await Settings.findOne();
    if (!settings) settings = new Settings();

    settings.apiKey = apiKey || settings.apiKey;
    await settings.save();
    res.status(200).json({ message: 'API key updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error updating API key' });
  }
});

module.exports = router;

