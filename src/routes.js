import { Router } from 'express';
import Multer from 'multer';
import multerConfig from './config/multer';
import UserController from './controllers/UserController';
import SessionController from './controllers/SessionController';
import authMiddleware from './middleware/auth';
import FileController from './controllers/FileController';

const upload = new Multer(multerConfig);
const routes = new Router();
routes.get('/debugsentry', (req, res) => {
  throw new Error('My first Sentry error!');
});
// Store User
routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

// For the next routes we need the authMiddleware running
routes.use(authMiddleware);
routes.put('/users', UserController.update);

routes.post('/files', upload.single('file'), FileController.store);
export default routes;
