import mongoose from 'mongoose';

const eventSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  type: { type: String, required: true },
  event_filters: {
    repository_name: { type: String, required: true },
    event_name: { type: String, required: true },
    filters: [
      {
        filter_key: { type: String, isRequired: true },
        filter_value: { type: mongoose.Schema.Types.Mixed, isRequired: true },
      },
    ],
  },
  light_animation: {
    animation_mode_id: { type: Number, required: true },
    duration: { type: Number, required: true },
  },
});

export default mongoose.model('Event', eventSchema);
