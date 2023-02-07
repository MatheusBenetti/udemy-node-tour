const catchAsync = require('../utils/catchAsync');
const Reviews = require('../models/reviewModel');
const factory = require('./handlerFactory');

exports.getReviewByTourId = catchAsync(async (req, res, next) => {
  let filter = {};

  if (req.params.tourId) filter = { tour: req.params.tourId };

  const reviews = await Reviews.find(filter);

  res.status(200).json({
    status: 'Success!',
    results: reviews.length,
    data: {
      reviews
    }
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;

  const review = await Reviews.create(req.body);

  res.status(201).json({
    status: 'Success!',
    data: {
      review
    }
  });
});

exports.updateReview = factory.updateOne(Reviews);

exports.deleteReview = factory.deleteOne(Reviews);
