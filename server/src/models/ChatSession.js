import mongoose from 'mongoose';

const chatSessionSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: String,
      default: null,
    },
    messages: [
      {
        role: {
          type: String,
          enum: ['user', 'assistant'],
        },
        content: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    lastQuery: String,
    lastResults: [mongoose.Schema.Types.ObjectId],
    lastRefinementConstraints: {
      maxPrice: Number,
      minPrice: Number,
      concerns: [String],
      range: String,
    },
    currentState: {
      type: String,
      enum: ['idle', 'searching', 'refining', 'in_cart'],
      default: 'idle',
    },
  },
  { timestamps: true }
);

chatSessionSchema.index({ sessionId: 1 });
chatSessionSchema.index({ userId: 1 });

export default mongoose.model('ChatSession', chatSessionSchema);
