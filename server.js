const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const app = require('./app');

// const database = process.env.DATABASE_CONNECTION;

mongoose
    // .connect(database, {
    //     useNewUrlParser: true,
    // })
    // .then(console.log('DB connection successful.'));
    .connect(process.env.DATABASE_LOCAL)
    .then(console.log('DB connection successful.'));

const port = 3000;
app.listen(port, () => {
    console.log(`App running on port ${port}.`);
});
