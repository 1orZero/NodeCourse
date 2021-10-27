const express = require('express');
const morgan = require('morgan');
const tourRouters = require('./routes/tourRouters');
const userRouters = require('./routes/userRouters');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use('/api/v1/tours', tourRouters);
app.use('/api/v1/users', userRouters);

module.exports = app;
