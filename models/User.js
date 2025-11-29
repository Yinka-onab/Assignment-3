const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  provider: { type: String, required: true },        // 'google' or 'github'
  providerId: { type: String, required: true },      // id from provider
  displayName: { type: String },
  email: { type: String },
  createdAt: { type: Date, default: Date.now }
});

// unique provider + providerId
UserSchema.index({ provider: 1, providerId: 1 }, { unique: true });

module.exports = mongoose.model('User', UserSchema);
