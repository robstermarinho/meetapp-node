import User from '../models/Users';
/*
 * User Controller
 */
class UserController {
  async store(req, res) {
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
