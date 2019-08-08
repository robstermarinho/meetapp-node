import * as Yup from 'yup';
import { isBefore, startOfDay, endOfDay, parseISO } from 'date-fns';
import { Op } from 'sequelize';
import Meetup from '../models/Meetup';
import File from '../models/File';
import User from '../models/Users';

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

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string()
        .min(2)
        .max(120),
      description: Yup.string()
        .min(3)
        .max(255),
      location: Yup.string()
        .min(1)
        .max(150),
      date: Yup.date(),
      banner_id: Yup.number(),
    });

    try {
      await schema.validate(req.body, {
        abortEarly: false,
      });
    } catch (e) {
      return res.status(400).json({ error: e.message, errorlist: e.errors });
    }
    // Get the current meetup and the user
    const meetup = await Meetup.findByPk(req.params.id);
    const userID = req.session.id;
    if (meetup.user_id !== userID) {
      return res
        .status(401)
        .json({ error: 'This user cannot update the meetup.' });
    }

    // Validate the data
    const parseDate = parseISO(req.body.date);
    const beforeToday = isBefore(parseDate, new Date());
    if (beforeToday) {
      return res.status(400).json({
        error: 'Ivalid data. You need to choose a date in the future.',
      });
    }

    // Check is in the past
    if (meetup.past) {
      return res
        .status(400)
        .json({ error: 'Impossible to update past meetups.' });
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

    await meetup.update(req.body);

    return res.json(meetup);
  }

  async index(req, res) {
    const { date, page } = req.query;
    const p = page || 1;
    const query = {
      where: {
        user_id: req.session.id,
      },
      order: ['date'],
      limit: 10,
      offset: 10 * p - 10,
      include: [
        {
          model: File,
          as: 'banner',
          attributes: ['name', 'path', 'url'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['name', 'path', 'url'],
            },
          ],
        },
      ],
    };

    // Using  the sequelize operator between to filter between dates
    if (date) {
      const parseDate = parseISO(date);
      query.where.date = {
        [Op.between]: [startOfDay(parseDate), endOfDay(parseDate)],
      };
    }

    const meetups = await Meetup.findAll(query);
    return res.json({ meetups });
  }

  async delete(req, res) {
    // Get the user logged in
    const userID = req.session.id;

    const meetup = await Meetup.findByPk(req.params.id);

    if (meetup.user_id !== userID) {
      return res
        .status(401)
        .json({ error: 'This user cannot delete this meetup.' });
    }

    if (meetup.past) {
      return res
        .status(400)
        .json({ error: 'Impossible to delete past meetups.' });
    }

    await meetup.destroy();
    return res.send({
      satus: 'ok',
    });
  }
}

export default new MeetupController();
