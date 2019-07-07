import { Router } from 'express';

const Routes = new Router();

// Root GET Route
Routes.get('/', (req, res) =>
  res.status(200).json({
    status: 'OK',
    app: 'Meetapp',
    description: 'Events Aggregator App',
  })
);

export default Routes;
