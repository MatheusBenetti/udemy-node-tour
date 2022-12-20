const Tour = require('../models/tourModel');

exports.getAllTours = async (req, res) => {
    try {
        const queryObject = { ...req.query };
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach((el) => delete queryObject[el]);

        const query = Tour.find(queryObject);

        const tours = await query;

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
        await Tour.findByIdAndDelete(req.params.id);
        res.status(200).json({
            status: 'Success!',
            message: 'Tour deleted!',
        });
    } catch (err) {
        res.status(404).json({
            status: 'Fail!',
            message: err,
        });
    }
};
