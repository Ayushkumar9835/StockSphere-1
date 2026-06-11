const mongoose = require("mongoose");
const PaymentSchema = require("../schemas/PaymentSchema");

const Payment = mongoose.model("Payment", PaymentSchema);

module.exports = { Payment };