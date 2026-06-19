import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || "yourverysecretkey";

// Protect routes middleware
export const protect = async (req, res, next) => {
  let token;

  if (req.cookies.token) {
    token = req.cookies.token;
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      isAdmin: decoded.isAdmin,
      verificationStatus: decoded.verificationStatus
    };
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

// Admin only middleware
export const adminOnly = (req, res, next) => {
  if (req.user && (req.user.isAdmin || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as admin' });
  }
};

// Business only middleware
export const businessOnly = (req, res, next) => {
  if (req.user && req.user.role === 'business') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as business' });
  }
};

// Verified business only middleware
export const verifiedBusinessOnly = (req, res, next) => {
  if (req.user && req.user.role === 'business' && req.user.verificationStatus === 'approved') {
    next();
  } else if (req.user && req.user.role === 'business' && req.user.verificationStatus === 'pending') {
    res.status(403).json({ message: 'Business account pending verification. Please wait for admin approval.' });
  } else if (req.user && req.user.role === 'business' && req.user.verificationStatus === 'rejected') {
    res.status(403).json({ message: 'Business verification rejected. Contact admin for details.' });
  } else {
    res.status(403).json({ message: 'Not authorized as verified business' });
  }
};
