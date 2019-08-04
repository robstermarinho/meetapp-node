import * as Yup from 'yup';
import User from '../models/Users';
/*
 * User Controller
 */
class UserController {
  // Store Users
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

  async update(req, res) {
    // Yup data validation
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string()
        .email()
        .required(),
      old_password: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('old_password', (old_password, field) =>
          old_password ? field.required() : field
        ),
      password_confirm: Yup.string().when('password', (password, field) =>
        password
          ? field
              .required()
              .oneOf(
                [Yup.ref('password')],
                'password and password_confirm does not match.'
              )
          : field
      ),
    });

    try {
      await schema.validate(req.body, {
        abortEarly: false,
      });
    } catch (e) {
      return res.status(400).json({ error: e.message, errorlist: e.errors });
    }

    // Find Current User in the session
    const user = await User.findByPk(req.session.id);

    const { email, old_password } = req.body;

    // 1) Email Check
    if (user.email !== email) {
      // Check if it's a preexisting email
      const userExists = await User.findOne({
        where: {
          email: req.body.email,
        },
      });

      if (userExists) {
        return res.status(400).json({
          error: 'This email already exists!',
        });
      }
    }

    // 2) Old Password Check
    if (old_password && !(await user.checkPassword(old_password))) {
      return res.status(401).json({ error: 'Old password id invalid.' });
    }

    const { id, name, updatedAt, avatar_id } = await user.update(req.body);

    return res.json({ user: { id, name, email, updatedAt, avatar_id } });
  }
}

export default new UserController();
