import { format, parseISO } from 'date-fns';
import en from 'date-fns/locale/en-US';
import Mail from '../../lib/Mail';

class MeetupNotificationMail {
  // We can return this variable wihtou the constructor
  get key() {
    return 'MeetupNotificationMail';
  }

  async handle({ data }) {
    const { meetup, subscription, user } = data;
    await Mail.sendMail({
      to: `${meetup.user.name} <${meetup.user.email}>`,
      subject: `${meetup.title} | New Subscription`,
      template: 'new_subscription',
      context: {
        subscription,
        meetup,
        organizer: meetup.user.name,
        user: `${user.name} - ${user.email}`,
        date: format(parseISO(subscription.created_at), "MMMM dd 'at' H:mm a", {
          locale: en,
        }),
      },
    });
  }
}

export default new MeetupNotificationMail();
