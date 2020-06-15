import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import crypto from 'crypto';

import eventsRoutes from './routes/events';
import usersRoutes from './routes/users';

const app = express();

//  -------   MIDDLEWARE  ------- //

// logging middleware
app.use(morgan('dev'));

// parser middleware

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ verify: verifyRequest }));

// CORS

const getSignature = (buf) => {
  var hmac = crypto.createHmac('sha1', process.env.GITHUB_SECRET);
  hmac.update(buf, 'utf-8');
  return 'sha1=' + hmac.digest('hex');
};

// Verify function compatible with body-parser to retrieve the request payload.
// Read more: https://github.com/expressjs/body-parser#verify
const verifyRequest = (req, res, buf, encoding) => {
  const expected = req.headers['x-hub-signature'];
  const calculated = getSignature(buf);
  console.log('X-Hub-Signature:', expected, 'Content:', '-' + buf.toString('utf8') + '-');
  if (expected !== calculated) {
    throw new Error('Invalid signature.');
  } else {
    console.log('Valid signature!');
  }
};

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  );
  // browser send first 'OPTIONS' requests before sending post requests
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
  next();
});

app.post('/webhook', (req, res) => {
  console.log('Webhook', res);
  res.status(200).send("done!");
});

//  -------   MIDDLEWARE  ------- //

// --------  MANGODB     ------- //

mongoose.connect(
  `mongodb+srv://pritesh:${process.env.MANGO_SECRET}@cluster0-pivh1.mongodb.net/${process.env.MANGO_DB}?retryWrites=true&w=majority`,
  { useMangoClient: true, useNewUrlParser: true, useUnifiedTopology: true },
);

mongoose.Promise = global.Promise;

// --------  MANGODB     ------- //

//  -------   ROUTES  ------- //

// Routes which should handle requests
app.use('/events', eventsRoutes);
app.use('/users', usersRoutes);

//  -------   ROUTES  ------- //

//  -------   ERROR  ------- //

app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  // forward error
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);

  const { message } = error;
  res.json({
    error: {
      message,
    },
  });
});

//  -------   ERROR  ------- //

export default app;
