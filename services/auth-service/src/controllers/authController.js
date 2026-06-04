const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Helper function to generate JWT
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret_key', {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d'
  });
};

const sendTokenResponse = (user, statusCode, res) => {
  const token = signToken(user._id);

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    }
  });
};

exports.register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ status: 'error', message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role
    });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ status: 'error', message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ status: 'error', message: 'Incorrect email or password' });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};
