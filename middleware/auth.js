const jwt = require('jsonwebtoken');

/**
 * User Authentication Middleware
 * Verifies the Bearer token sent in the Authorization header.
 * Extracts userId and userPhone for use in subsequent routes.
 */
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ message: 'No token provided' });

  jwt.verify(token.split(' ')[1], process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Unauthorized' });
    req.userId = decoded.id;
    req.userPhone = decoded.phone;
    next();
  });
};

/**
 * Admin Authentication Middleware
 * Verifies a specific admin token sent in the 'x-admin-token' header.
 * Ensures the decoded role matches 'admin'.
 */
const verifyAdmin = (req, res, next) => {
  const token = req.headers['x-admin-token'];
  if (!token) return res.status(403).json({ message: 'Admin access denied' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err || decoded.role !== 'admin') return res.status(401).json({ message: 'Invalid Admin Token' });
    next();
  });
};

module.exports = { verifyToken, verifyAdmin };
