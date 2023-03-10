const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appErrors');
const sendMail = require('../utils/email');

const signToken = (id) =>
  jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookiesOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIES_EXPIRES_IN),
    secure: true,
    httpOnly: true
  };

  res.cookie('jwt', token, cookiesOptions);

  res.status(statusCode).json({
    status: 'Success!',
    token,
    data: {
      user
    }
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);

  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  const user = await User.findOne({ email });

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Invalid email or password!', 401));
  }

  createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(new AppError('The token is no longer valid.', 401));
  }

  if (currentUser.changePasswordAfterLogin(decoded.iat)) {
    return next(
      new AppError(
        'User recently changed the password! Please log in again.',
        401
      )
    );
  }

  req.user = currentUser;

  next();
});

exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action.', 403)
      );
    }
    next();
  };

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(
      new AppError('There is no user registered with this email address.', 404)
    );
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/reset-password/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to:
  ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendMail({
      email: user.email,
      subject: 'Your password reset token(valid for 10 minutes)',
      message
    });

    res.status(200).json({
      status: 'Success!',
      message: 'Token sent to email'
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;

    await user.save({ validateBeforeSave: false });

    return next(
      AppError('There was an error sending the email. Try again later.', 500)
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetTokenExpires: { $gt: Date.now() }
  });

  if (!user) {
    return next('Token is invalid or has expired!', 400);
  }

  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpires = undefined;

  await user.save();

  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new AppError('No user found on the system.', 404));
  }

  if (!user.correctPassword(req.body.currentPassword, user.password)) {
    return next(new AppError('Your current password is wrong!', 401));
  }

  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  await user.save();

  createSendToken(user, 200, res);
});
