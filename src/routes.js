import { Router } from 'express';
import UserController from './controllers/UserController';
import SessionController from './controllers/SessionController';
import authMiddleware from './middleware/auth';

const routes = new Router();

// Store User
routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

// For the next routes we need the authMiddleware running
routes.use(authMiddleware);
routes.put('/users', UserController.update);

export default routes;
