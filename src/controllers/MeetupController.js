import * as Yup from 'yup';
import { parseISO, isBefore } from 'date-fns';
import Meetup from '../models/Meetup';
import File from '../models/File';

class MeetupController {
  async store(req, res) {
    // Yup data validation schema
    const schema = Yup.object().shape({
      title: Yup.string()
        .min(2)
        .max(120)
        .required(),
      description: Yup.string()
        .min(3)
        .max(255)
        .required(),
      location: Yup.string()
        .min(1)
        .max(150)
        .required(),
      date: Yup.date().required(),
      banner_id: Yup.number().required(),
    });

    // Validate the schema and get the errors
    try {
      await schema.validate(req.body, {
        abortEarly: false, // return from validation methods validations errors.
      });
    } catch (e) {
      return res.status(400).json({ error: e.message, errorlist: e.errors });
    }
    // Parse date
    const parseDate = parseISO(req.body.date);
    const beforeToday = isBefore(parseDate, new Date());
    if (beforeToday) {
      return res.status(400).json({
        error: 'Ivalid data. You need to choose a date in the future.',
      });
    }

    // Validate Banner
    const isFile = await File.findOne({
      where: { id: req.body.banner_id },
    });
    if (!isFile) {
      return res.status(400).json({
        error: 'Invalid Banner. You need to define a valid File.',
      });
    }

    // Get the user logged in
    const userID = req.session.id;

    // create the meetup
    const meetup = await Meetup.create({
      ...req.body,
      user_id: userID,
    });

    return res.json(meetup);
  }
}

export default new MeetupController();
