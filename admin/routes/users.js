const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Fetch all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching users', error: err.message });
    }
});

// Block a user
router.patch('/:id/block', async (req, res) => {
    try {
        const userId = req.params.id;

        // Update the user's `blocked` field to true
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: { blocked: true } },
            { new: true } // Return the updated user document
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User blocked successfully', user: updatedUser });
    } catch (err) {
        res.status(500).json({ message: 'Error blocking user', error: err.message });
    }
});

// Delete a user
router.delete('/:id', async (req, res) => {
    try {
        const userId = req.params.id;

        // Delete the user
        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting user', error: err.message });
    }
});

module.exports = router;
