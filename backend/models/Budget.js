const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  amount: {
    type: Number,
    required: [true, 'Budget amount is required'],
    min: [1, 'Budget must be at least ₹1']
  },
  month: {
    type: String, // "2025-03"
    default: () => new Date().toISOString().slice(0, 7)
  }
}, { timestamps: true });

module.exports = mongoose.model('Budget', budgetSchema);
