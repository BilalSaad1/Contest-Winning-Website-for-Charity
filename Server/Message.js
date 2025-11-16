
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: String,
  content: String,
  type: String, // 'text' or 'audio'
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Message', messageSchema);
