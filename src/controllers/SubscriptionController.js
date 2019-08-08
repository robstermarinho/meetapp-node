import Meetup from '../models/Meetup';
import User from '../models/Users';
import Subscription from '../models/Subscription';

class SubscriptionController {
  async store(req, res) {
    // Get the user logged in
    const userID = req.session.id;
    const meetup = await Meetup.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['name', 'email'],
          as: 'user',
        },
      ],
    });
    if (!meetup) {
      return res.status(400).json({ error: 'Meetup not found' });
    }
    if (meetup.user.id === userID) {
      return res
        .status(400)
        .json({ error: "You can't subscribe to your own meetups" });
    }

    if (meetup.past) {
      return res
        .status(400)
        .json({ error: 'Impossible to subscribe to past meetups.' });
    }

    const subscriptionDateExists = await Subscription.findOne({
      where: {
        user_id: userID,
      },
      include: [
        {
          model: Meetup,
          as: 'meetup',
          required: true,
          where: {
            date: meetup.date,
          },
        },
      ],
    });

    if (subscriptionDateExists) {
      return res.status(400).json({ error: 'Impossible to subscribe twice.' });
    }

    const subscription = await Subscription.create({
      user_id: userID,
      meetup_id: meetup.id,
    });

    return res.json(subscription);
  }
}

export default new SubscriptionController();
