import express from 'express';
import { registerUser, loginUser, adminLogin, logoutUser, getCurrentUser } from '../controllers/authController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Authentication routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/admin/login', adminLogin);
router.post('/logout', logoutUser);
router.get('/me', protect, getCurrentUser);

// Check authentication status
router.get('/verify', protect, (req, res) => {
  res.status(200).json({ isAuthenticated: true });
});

// Admin check route
router.get('/admin/verify', protect, adminOnly, (req, res) => {
  res.status(200).json({ isAdmin: true });
});

export default router;
