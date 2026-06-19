import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import User from '../models/userModel.js';

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, userData: user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.put('/', protect, async (req, res) => {
  try {
    const allowed = {};
    const fields = ['firstName', 'lastName', 'email', 'mobileNumber', 'country', 'city', 'streetAddress', 'gender'];
    for (const f of fields) {
      if (req.body[f] !== undefined) allowed[f] = req.body[f];
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: allowed },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, updatedUser });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
});

export default router;
