const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },

  date: {
    type: Date,
    required: true
  },

  location: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  // NEW: Owner field (required for protecting Edit/Delete)
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false  // some events might not have a user (legacy)
  }

}, { timestamps: true });  // optional but very useful
                           // adds createdAt and updatedAt fields automatically

module.exports = mongoose.model("Event", EventSchema);

