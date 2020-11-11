import express from 'express';
import mongoose from 'mongoose';

import LightAnimation from '../models/lightAnimations';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const lightAnimations = await LightAnimation.find().exec();
    const response = { count: lightAnimations.length, lightAnimations };

    res.status(200).json(response);
  } catch (e) {
    res.status(500).json({ Error: e });
  }
});

// --------  POST  --------//

router.post('/', async (req, res) => {
  try {
    const payload = req.body;

    const animation = new LightAnimation({
      _id: new mongoose.Types.ObjectId(),
      ...payload,
    });

    const result = await animation.save();

    if (result) {
      res.status(201).json({
        message: 'Created new animation',
        animation: result,
      });
    }
  } catch (error) {
    console.log('Error POST', error); // eslint-disable-line no-console
    res.status(500).json({ error });
  }
});

export default router;
