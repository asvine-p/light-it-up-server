import mongoose from 'mongoose';

const githubRepositorySchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  repository_id: { type: Number, isRequired: true },
  node_id: { type: String, isRequired: true },
  name: { type: String, isRequired: true },
  full_name: { type: String, isRequired: true },
  html_url: { type: String, isRequired: true },
  description: String,
  url: { type: String, isRequired: true },
  events: { type: [String], isRequired: true },
});

export default mongoose.model('GithubRepository', githubRepositorySchema);
