import mongoose from 'mongoose';

const lightAnimationSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  animationId: { type: Number, isRequired: true },
  name: { type: String, isRequired: true },
});

export default mongoose.model('LightAnimation', lightAnimationSchema);
