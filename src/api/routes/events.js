import express from 'express';
import Event from '../models/events';
import mongoose from 'mongoose';
import { formatEventResponse, formatEventsResponse } from '../utils/formatData';
import { EVENT_QUERY } from '../../constatns/eventQuerries';

const router = express.Router();

// --------  GET  --------//

router.get('/', async (req, res, next) => {
  try {
    const foundEvents = await Event.find().select(EVENT_QUERY).exec();
    const response = formatEventsResponse(foundEvents);

    res.status(200).json(response);
  } catch (e) {
    res.status(500).json({ Error: e });
  }
});

router.get('/:eventId', async (req, res, next) => {
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
    console.log(e);
    res.status(500).json({ error: e });
  }
});

// --------  POST  --------//

router.post('/', async (req, res) => {
  try {
    const payload = req.body;
    console.log('payload', payload);

    const { type, event_filters, light_animation } = payload;

    const event = new Event({
      _id: new mongoose.Types.ObjectId(),
      type,
      event_filters,
      light_animation,
    });

    const result = await event.save();

    if (result) {
      res.status(201).json({
        message: 'Created new Event',
        event: formatEventResponse(result),
      });
    }
  } catch (error) {
    console.log('Error POST', error);
    res.status(500).json({ error });
  }
});

// --------  PATCH  --------//

router.put('/:eventId', async (req, res, next) => {
  try {
    const id = req.params.eventId;
    const updateOps = {};
    for (const ops of req.body) {
      const { key, value } = ops;

      updateOps[key] = value;
    }
    const result = await Event.update({ _id: id }, { $set: updateOps }).exec();

    if (result) {
      res.status(200).json({
        message: `Event ${id} modified successfully`,
      });
    } else {
      res.status(404).json({ message: 'No event found' });
    }
  } catch (e) {
    console.log('Error update', e);
    res.status(500).json({
      error: e,
    });
  }
});

// --------  DELETE  --------//

router.delete('/:eventId', async (req, res, next) => {
  try {
    const id = req.params.eventId;

    const result = await Event.remove({ _id: id }).exec();
    if (result) {
      res.status(200).json({
        message: 'Product deleted with success',
      });
    } else {
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: e });
  }
});

export default router;
