const mongoose = require("mongoose");
const orderSchema = require("../schemas/OrderSchema");

const OrdersModel = mongoose.model("Order", orderSchema);

module.exports = OrdersModel;