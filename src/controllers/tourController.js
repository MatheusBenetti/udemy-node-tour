const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');

exports.aliasTopTours = async (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = 'price,-ratingAverage';
    req.query.fields = 'name,price,ratingAverage,summary,difficulty';
    next();
};

exports.getAllTours = async (req, res) => {
    try {
        const features = new APIFeatures(Tour.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .pagination();
        const tours = await features.query;

        res.status(200).json({
            status: 'Success!',
            results: tours.length,
            data: {
                tours,
            },
        });
    } catch (err) {
        res.status(404).json({
            status: 'Fail!',
            message: err,
        });
    }
};

exports.getTourById = async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id);
        res.status(200).json({
            status: 'Success!',
            data: {
                tour,
            },
        });
    } catch (err) {
        res.status(404).json({
            status: 'Fail!',
            message: err,
        });
    }
};

exports.createTour = async (req, res) => {
    try {
        const newTour = await Tour.create(req.body);

        res.status(201).json({
            status: 'Success!',
            data: {
                tour: newTour,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: 'Fail!',
            message: err,
        });
    }
};

exports.updateTour = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        res.status(200).json({
            status: 'Success!',
            data: {
                tour,
            },
        });
    } catch (err) {
        res.status(404).json({
            status: 'Fail!',
            message: err,
        });
    }
};

exports.deleteTour = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndDelete(req.params.id);

        if (!tour) {
            throw new Error('No tour registered.');
        }

        res.status(200).json({
            status: 'Success!',
            data: {
                tour,
            },
        });
    } catch (err) {
        res.status(404).json({
            status: 'Fail!',
            message: 'No tour registered.',
        });
    }
};

exports.getTourStats = async (req, res) => {
    try {
        const stats = await Tour.aggregate([
            {
                $match: { ratingAverage: { $gte: 4.5 } },
            },
            {
                $group: {
                    _id: '$difficulty',
                    numTours: { $sum: 1 },
                    numRatings: { $sum: '$ratingQuantity' },
                    avgRating: { $avg: '$ratingAverage' },
                    avgPrice: { $avg: '$price' },
                    minPrice: { $min: '$price' },
                    maxPrice: { $max: '$price' },
                },
            },
            {
                $sort: { avgPrice: 1 },
            },
        ]);

        res.status(200).json({
            status: 'Success!',
            data: {
                stats,
            },
        });
    } catch (err) {
        res.status(404).json({
            status: 'Fail!',
            message: err,
        });
    }
};
