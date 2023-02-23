const User = require('../models/userModel');
const AppError = require('../utils/appErrors');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
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

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'Success.',
    data: null
  });
});

exports.getAllUsers = factory.getAll(User);
exports.getUsersById = factory.getOne(User);

exports.createUsers = (req, res) => {
  res.status(500).json({
    status: 'Error!',
    message: 'This route is not defined. Please, use /signup instead.'
  });
};

exports.updateUsers = factory.updateOne(User);
exports.deleteUsers = factory.deleteOne(User);
