const mongoose = require("mongoose");

const TrashSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    height: {
        type: Number,
        required: true,
        default: 100
    },
    label: {
        type: String,
        default: "No label"
    },
    current_level: {
        type: Number,
        default: 0
    },
    created_at: {
        type: Date,
        default: Date.now
    }
}, { _id: false });

const TrashModel = mongoose.model("trashes", TrashSchema);

module.exports = TrashModel;
