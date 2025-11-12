const mongoose = require('mongoose');

const diaryEntrySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // Date for this diary entry (stored as start of day in UTC)
  date: {
    type: Date,
    required: true
  },
  // Array of encrypted entries for this day
  entries: [{
    // Encrypted content
    content: {
      type: String,
      required: true
    },
    // Encrypted title/heading for the entry
    title: {
      type: String,
      default: ''
    },
    // Initialization vector for decryption
    iv: {
      type: String,
      required: true
    },
    // Mood/emotion tag
    mood: {
      type: String,
      enum: ['great', 'good', 'okay', 'bad', 'terrible', ''],
      default: ''
    },
    // Time of entry creation
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  }],
  // Metadata
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index to ensure one diary document per user per day
diaryEntrySchema.index({ user: 1, date: 1 }, { unique: true });

// Update timestamp on save
diaryEntrySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Diary', diaryEntrySchema);