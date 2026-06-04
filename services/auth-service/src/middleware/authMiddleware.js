const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ status: 'error', message: 'Not authorized to access this route' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');

    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res.status(401).json({ status: 'error', message: 'The user belonging to this token does no longer exist.' });
    }

    next();
  } catch (error) {
    res.status(401).json({ status: 'error', message: 'Not authorized to access this route' });
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ status: 'error', message: 'You do not have permission to perform this action' });
    }
    next();
  };
};
