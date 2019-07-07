import express from 'express';
import Routes from './routes';

class App {
  constructor() {
    this.server = express(); // Get the instance of server
    this.routes();
  }

  // Set the routes
  routes() {
    this.server.use(Routes);
  }
}

export default new App().server;
