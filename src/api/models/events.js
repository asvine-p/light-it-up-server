import mongoose from 'mongoose';

const eventSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  type: { type: String, required: true },
  light_animation: { type: Object, required: true },
});

export default mongoose.model('Event', eventSchema);
