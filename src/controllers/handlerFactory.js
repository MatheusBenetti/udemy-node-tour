const AppError = require('../utils/appErrors');
const catchAsync = require('../utils/catchAsync');

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!doc) {
      return next(new AppError('No document found with that ID.', 404));
    }

    res.status(200).json({
      status: 'Success!',
      data: {
        tour: doc
      }
    });
  });

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError('No document found with that ID.', 404));
    }

    res.status(204).json({
      status: 'Success!',
      data: null
    });
  });
