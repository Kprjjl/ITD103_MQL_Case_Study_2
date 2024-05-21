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
        type: String
    },
    created_at: {
        type: Date,
        default: Date.now
    }
}, { _id: false });

const TrashModel = mongoose.model("Trash", TrashSchema);

module.exports = TrashModel;
