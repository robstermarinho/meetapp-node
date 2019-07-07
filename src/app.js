import express from 'express';
import routes from './routes';
import './database';

class App {
  constructor() {
    this.server = express(); // Get the instance of server

    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(express.json());
  }

  // Set the routes
  routes() {
    this.server.use(routes);
  }
}

export default new App().server;
