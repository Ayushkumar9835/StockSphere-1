const mongoose = require("mongoose");
const positionSchema = require("../schemas/PositionSchema");

const PositionModel = mongoose.model("Position", positionSchema);

module.exports = PositionModel;