import multer from 'multer';
import crypto from 'crypto';
import { extname, resolve } from 'path';

// Create disk storage
export default {
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    filename: (req, file, cb) => {
      // callback function to create the filename

      // Generate a random name to the filename
      crypto.randomBytes(16, (err, res) => {
        // First parameter is passing the error
        if (err) return cb(err);

        return cb(null, res.toString('hex') + extname(file.originalname));
      });
    },
  }),
};
