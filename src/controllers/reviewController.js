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

exports.setTourUserIds = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllReviews = factory.getAll(Reviews);
exports.getReview = factory.getOne(Reviews);
exports.createReview = factory.createOne(Reviews);
exports.updateReview = factory.updateOne(Reviews);
exports.deleteReview = factory.deleteOne(Reviews);
