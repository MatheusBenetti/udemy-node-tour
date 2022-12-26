const express = require('express');
const morgan = require('morgan');

const globalErrorHandler = require('./src/controllers/errorController');
const AppError = require('./src/utils/appErrors');
const tourRouter = require('./src/routes/tourRoutes');
const userRouter = require('./src/routes/userRoutes');

const app = express();

app.use(morgan('dev'));

app.use(express.json());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server.`));
});

app.use(globalErrorHandler);

module.exports = app;
