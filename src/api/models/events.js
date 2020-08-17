import mongoose from 'mongoose';

const eventSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  type: { type: String, required: true },
  eventFilters: {
    repositoryName: { type: String, required: true },
    eventName: { type: String, required: true },
    filters: [
      {
        filterKey: { type: String, isRequired: true },
        filterValue: { type: mongoose.Schema.Types.Mixed, required: true },
      },
    ],
  },
  animation: {
    lightAnimation: { type: mongoose.Schema.Types.ObjectId, ref: 'LightAnimation' },
    duration: { type: Number, required: true },
  },
});

export default mongoose.model('Event', eventSchema);
