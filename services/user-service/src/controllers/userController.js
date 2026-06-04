const Profile = require('../models/Profile');

exports.getProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne({ userId: req.user.id });
    
    if (!profile) {
      // Create empty profile if it doesn't exist
      profile = await Profile.create({ userId: req.user.id });
    }

    res.status(200).json({
      status: 'success',
      data: {
        profile
      }
    });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, phoneNumber, address, avatar } = req.body;
    
    let profile = await Profile.findOne({ userId: req.user.id });
    
    if (!profile) {
      profile = new Profile({ userId: req.user.id });
    }

    if (firstName) profile.firstName = firstName;
    if (lastName) profile.lastName = lastName;
    if (phoneNumber) profile.phoneNumber = phoneNumber;
    if (address) profile.address = address;
    if (avatar) profile.avatar = avatar;

    await profile.save();

    res.status(200).json({
      status: 'success',
      data: {
        profile
      }
    });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};
