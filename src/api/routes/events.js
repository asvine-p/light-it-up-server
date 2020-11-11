import express from 'express';
import mongoose from 'mongoose';
import Event from '../models/events';
import LightAnimation from '../models/lightAnimations';
import { formatEventResponse, formatEventsResponse } from '../utils/formatData';
import { EVENT_QUERY } from '../../constants/querriesConstant';

const router = express.Router();

// --------  GET  --------//

router.get('/', async (req, res) => {
  try {
    const foundEvents = await Event.find()
      .select(EVENT_QUERY)
      .populate({
        path: 'animation',
        populate: { path: 'lightAnimation', model: 'LightAnimation' },
      })
      .exec();

    const response = formatEventsResponse(foundEvents);

    res.status(200).json(response);
  } catch (e) {
    res.status(500).json({ Error: e });
  }
});

router.get('/:eventId', async (req, res) => {
  try {
    const id = req.params.eventId;
    const foundEvent = await Event.findById(id).exec();

    if (foundEvent) {
      const response = formatEventResponse(foundEvent);

      res.status(200).json(response);
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    res.status(500).json({ error: e });
  }
});

// --------  POST  --------//

router.post('/', async (req, res) => {
  try {
    const payload = req.body;

    // eslint-disable-next-line camelcase
    const { type, eventFilters, animation: { animationId, duration } = {} } = payload;
    const lightAnimation = await LightAnimation.findById(animationId).exec();

    if (lightAnimation) {
      const event = new Event({
        _id: new mongoose.Types.ObjectId(),
        type,
        eventFilters,
        animation: {
          lightAnimation,
          duration,
        },
      });

      const result = await event.save();

      if (result) {
        res.status(201).json({
          message: 'Created new Event',
          event: formatEventResponse(result),
        });
      }
    } else {
      res.status(403).json({
        message: 'Bad parameters',
      });
    }
  } catch (error) {
    console.log('Error POST', error); // eslint-disable-line no-console
    res.status(500).json({ error });
  }
});

// --------  PATCH  --------//

router.put('/:eventId', async (req, res) => {
  try {
    const id = req.params.eventId;
    const updateOps = {};
    req.body.forEach(({ key, value }) => {
      updateOps[key] = value;
    });
    const result = await Event.update({ _id: id }, { $set: updateOps }).exec();

    if (result) {
      res.status(200).json({
        message: `Event ${id} modified successfully`,
      });
    } else {
      res.status(404).json({ message: 'No event found' });
    }
  } catch (e) {
    console.log('Error update', e); // eslint-disable-line no-console
    res.status(500).json({
      error: e,
    });
  }
});

// --------  DELETE  --------//

router.delete('/:eventId', async (req, res) => {
  try {
    const id = req.params.eventId;

    const result = await Event.remove({ _id: id }).exec();
    if (result) {
      res.status(200).json({
        message: 'Product deleted with success',
      });
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    res.status(500).json({ error: e });
  }
});

export default router;
