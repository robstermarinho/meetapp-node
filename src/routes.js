import { Router } from 'express';
import Multer from 'multer';
import multerConfig from './config/multer';
import UserController from './controllers/UserController';
import SessionController from './controllers/SessionController';
import authMiddleware from './middleware/auth';
import FileController from './controllers/FileController';
import MeetupController from './controllers/MeetupController';
import SubscriptionController from './controllers/SubscriptionController';

const upload = new Multer(multerConfig);
const routes = new Router();

// Store User
routes.post('/users', UserController.store);
// Obtain token
routes.post('/sessions', SessionController.store);

// For the next routes we need the authMiddleware
routes.use(authMiddleware);
// Update user controller
routes.put('/users', UserController.update);

// List all meetups in the date
routes.get('/meetups', MeetupController.index);
// List all meetups the user is organizing
routes.get('/organizing', MeetupController.organizing);
// Store meetups
routes.post('/meetups', MeetupController.store);
// Update meetups
routes.put('/meetups/:id', MeetupController.update);
// Delete meetups
routes.delete('/meetups/:id', MeetupController.delete);

// Store meetups
routes.post('/meetups/:id/subscriptions', SubscriptionController.store);

routes.post('/files', upload.single('file'), FileController.store);
export default routes;
