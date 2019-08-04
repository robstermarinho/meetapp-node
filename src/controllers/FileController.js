import * as Yup from 'yup';
import File from '../models/File';

class FileController {
  async store(req, res) {
    if (!req.file) {
      return res.status(400).json({ error: 'File is missing.' });
    }
    const { originalname: name, filename: path } = req.file;
    const file = await File.create({
      name,
      path,
    });

    return res.json(file);
  }
}

export default new FileController();
