import mongoose from 'mongoose';

const FeedbackSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, default: '' },
    rating: { type: Number, required: true },
    message: { type: String, required: true },
    timestamp: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model('Feedback', FeedbackSchema);
