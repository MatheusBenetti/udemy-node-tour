const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name.'],
        unique: true,
        trim: true,
    },
    ratingAverage: {
        type: Number,
        default: 3.0,
    },
    ratingQuantity: {
        type: Number,
        default: 0,
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price.'],
    },
    discountPrice: Number,
    duration: {
        type: Number,
        required: [true, 'A tour must have a duration.'],
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'The tour need to have a maximum number of people'],
    },
    difficulty: {
        type: String,
        required: [true, 'People must know if they are able go to the tour'],
    },
    summery: {
        type: String,
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    startDates: [Date],
});
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
