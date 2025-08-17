const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: { type: String, required: true }, // UUID string of user receiving notification
  sender: { type: String, required: true },    // UUID string of user who triggered notification
  type: { 
    type: String, 
    enum: ["comment", "like", "follow", "system"], 
    required: true 
  },
  message: { type: String, required: true },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  commentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
