import * as Yup from 'yup';
import User from '../models/Users';
/*
 * User Controller
 */
class UserController {
  async store(req, res) {
    // Yup data validation schema
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .required()
        .email(),
      password: Yup.string()
        .required()
        .min(6),
    });
    // Validate the schema and get the errors
    try {
      await schema.validate(req.body, {
        abortEarly: false, // return from validation methods validations errors.
      });
    } catch (e) {
      return res.status(400).json({ error: e.message, errorlist: e.errors });
    }

    // Get email
    const { email } = req.body;

    // Check if user with provided email exists
    const user = await User.findOne({
      where: {
        email,
      },
    });
    if (user) {
      return res.status(400).json({
        error: 'User with this email already exists.',
      });
    }

    const { id, name } = await User.create(req.body);
    return res.json({ id, name, email });
  }
}

export default new UserController();
