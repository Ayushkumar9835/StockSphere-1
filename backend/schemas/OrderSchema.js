const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  name: {
    type: String,
    required: true,
  },

  qty: {
    type: Number,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },

  model: {
    type: String,
  },

  payment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Payment",
  },

  status: {
    type: String,
    enum: ["pending", "completed"],
    default: "pending",
  },

  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = OrderSchema;