import { Router } from 'express';
import UserController from './controllers/UserController';

const routes = new Router();

// Root GET Route
routes.get('/', (req, res) =>
  res.status(200).json({
    status: 'OK',
    app: 'Meetapp',
    description: 'Events Aggregator Apps',
  })
);

// Store User
routes.post('/users', UserController.store);

export default routes;
