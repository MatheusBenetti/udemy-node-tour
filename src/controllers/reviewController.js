const catchAsync = require('../utils/catchAsync');
const Reviews = require('../models/reviewModel');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  const reviews = await Reviews.find();

  res.status(200).json({
    status: 'Success!',
    results: reviews.length,
    data: {
      reviews
    }
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  const review = await Reviews.create(req.body);

  res.status(201).json({
    status: 'Success!',
    data: {
      review
    }
  });
});
