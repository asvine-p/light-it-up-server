import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

import eventsRoutes from './routes/events';
import usersRoutes from './routes/users';
import githubWebhooksRoutes from './webhooks/github';

const app = express();


//  -------   MIDDLEWARES  ------- //

// logging middleware
app.use(morgan('dev'));

// parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


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

// --------  MANGODB     ------- //

mongoose.connect(
  `mongodb+srv://pritesh:${process.env.MANGO_SECRET}@cluster0-pivh1.mongodb.net/${process.env.MANGO_DB}?retryWrites=true&w=majority`,
  { useMangoClient: true, useNewUrlParser: true, useUnifiedTopology: true },
);

mongoose.Promise = global.Promise;


//  -------   ROUTES  ------- //

// Routes which should handle requests
app.use('/events', eventsRoutes);
app.use('/users', usersRoutes);
app.use('/webhooks', githubWebhooksRoutes);


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
