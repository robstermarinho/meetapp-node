import * as Yup from 'yup';
import jwt from 'jsonwebtoken';
import User from '../models/Users';
import authConfig from '../config/auth';
/*
 * Session Controller
 */
class SessionController {
  async store(req, res) {
    // Yup data validation schema
    const schema = Yup.object().shape({
      email: Yup.string()
        .required()
        .email(),
      password: Yup.string().required(),
    });

    // Validate the schema and get the errors
    try {
      await schema.validate(req.body, {
        abortEarly: false,
      });
    } catch (e) {
      return res.status(400).json({ error: e.message, errorlist: e.errors });
    }

    const { email, password } = req.body;

    // Try to find user with the email provided
    const user = await User.findOne({
      where: { email },
    });
    if (!user) {
      return res
        .status(401)
        .json({ error: 'User with this email was not found!' });
    }

    // After find the user check the provided password
    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Password does not match!' });
    }

    const { id, name } = user;

    // Generate JWT token with header, payload and signature
    const token = jwt.sign({ id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });
    // Return the response Object
    return res.json({
      user: {
        id,
        name,
        email,
        token,
      },
    });
  }
}

export default new SessionController();
