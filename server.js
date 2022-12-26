const dotenv = require('dotenv');
const mongoose = require('mongoose');

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config();

const app = require('./app');

// const database = process.env.DATABASE_CONNECTION;

mongoose
  .set({ strictQuery: false })
  // .connect(database, {
  //     useNewUrlParser: true,
  // })
  // .then(console.log('DB connection successful.'));
  .connect(process.env.DATABASE_LOCAL)
  .then(console.log('DB connection successful.'));

const port = 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
