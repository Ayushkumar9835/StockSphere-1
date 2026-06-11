const mongoose = require("mongoose");
const holdingSchema = require("../schemas/HoldingSchema");

const HoldingsModel = mongoose.model("Holding", holdingSchema);

module.exports = HoldingsModel;