const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
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

module.exports = mongoose.model('User', userSchema);