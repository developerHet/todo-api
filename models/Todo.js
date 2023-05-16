const mongoose = require("mongoose");

const TodoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please add a title"],
    trim: true,
  },
  priority: {
    type: Number,
    min: [1, "priority must be at least 1"],
    max: [10, "priority must can not be more than 9"],
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ["pending", "completed", "canceled"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Todo", TodoSchema);
