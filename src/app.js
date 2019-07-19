import 'dotenv/config';
import Youch from 'youch';
import express from 'express';
import * as Sentry from '@sentry/node';
import sentryConfig from './config/sentry';
import 'express-async-errors';
import routes from './routes';
import './database';

class App {
  constructor() {
    this.server = express(); // Get the instance of server

    Sentry.init(sentryConfig); // Init Sentry with config

    this.middlewares();
    this.routes();

    this.exceptionHandler();
  }

  middlewares() {
    // Sentry - The request handler must be the first middleware on the app
    this.server.use(Sentry.Handlers.requestHandler());
    // Accept Json
    this.server.use(express.json());
  }

  // Set the routes
  routes() {
    this.server.use(routes);

    // The error handler must be before any other error middleware and after all controllers
    this.server.use(Sentry.Handlers.errorHandler());
  }

  exceptionHandler() {
    this.server.use(async (err, req, res, next) => {
      // Display detailed youch error in the resposnse when it is development server
      if (process.env.NODE_ENV === 'development') {
        const errors = await new Youch(err, req).toJSON();
        return res.status(500).json(errors);
      }
      // For not development server we are going to send this message:
      return res.status(500).json({ error: 'Internal Server Error' });
    });
  }
}

export default new App().server;
