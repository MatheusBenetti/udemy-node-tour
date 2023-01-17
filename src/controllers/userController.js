const User = require('../models/userModel');
const AppError = require('../utils/appErrors');
const catchAsync = require('../utils/catchAsync');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

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

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.confirmPassword) {
    return next(new AppError(`This route isn't for password updates. `, 400));
  }

  const filteredBody = filterObj(req.body, 'name', 'email');

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'Success.',
    user: { updatedUser }
  });
});

exports.getUsersById = (req, res) => {};

exports.createUsers = (req, res) => {};

exports.updateUsers = (req, res) => {};

exports.deleteUsers = (req, res) => {};
