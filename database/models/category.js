const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  recipies: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Recepie'
    }
  ]
}, {
  timestamps: true
});

module.exports = mongoose.model('Category', categorySchema);