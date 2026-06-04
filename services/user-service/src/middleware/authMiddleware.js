const jwt = require('jsonwebtoken');

exports.protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ status: 'error', message: 'Not authorized to access this route' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');

    // Attach user payload to request (note: we don't query the DB here to keep user-service decoupled from auth-db)
    // The decoded token typically contains the user id and role
    req.user = decoded;
    
    next();
  } catch (error) {
    res.status(401).json({ status: 'error', message: 'Not authorized to access this route', details: error.message });
  }
};
