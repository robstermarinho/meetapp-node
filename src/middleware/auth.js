import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import authConfig from '../config/auth';

/*
 * Authentication Middleware
 * Responsible to handle the JWT token for authenticated users
 * It will verify if the token has been provided
 * And if it's a valid token
 */
export default async (req, res, next) => {
  // Get the Authorization in the Header
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token has not been provided.' });
  }
  // Obtain only the token portion from the authHeder
  const [, token] = authHeader.split(' ');

  try {
    // Promisify return a function so we call it with the callback parameters of the original function.
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);
    // Send session to the request
    req.session = decoded;
    return next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token.' });
  }
};
