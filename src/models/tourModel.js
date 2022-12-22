const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'A tour must have a name.'],
            unique: true,
            trim: true,
        },
        slug: String,
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
            required: [
                true,
                'The tour need to have a maximum number of people',
            ],
        },
        difficulty: {
            type: String,
            required: [
                true,
                'People must know if they are able go to the tour',
            ],
        },
        summary: {
            type: String,
            trim: true,
        },
        createdAt: {
            type: Date,
            default: Date.now(),
        },
        startDates: [Date],
        secretTour: {
            type: Boolean,
            default: false,
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

tourSchema.virtual('durationWeeks').get(function () {
    return this.duration / 7;
});

tourSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

tourSchema.pre(/^find/, function (next) {
    this.find({ secretTour: { $ne: true } });

    this.start = Date.now();
    next();
});

tourSchema.post(/^find/, function (docs, next) {
    console.log(`Query took ${Date.now() - this.start} milliseconds.`);
    console.log(docs);
    next();
});

tourSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });

    console.log(this.pipeline());
    next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
