const User = require('../models/userModel');

exports.getAllUsers = async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: 'Success!',
    result: users.length,
    data: {
      users
    }
  });
};

exports.getUsersById = (req, res) => {};

exports.createUsers = (req, res) => {};

exports.updateUsers = (req, res) => {};

exports.deleteUsers = (req, res) => {};
