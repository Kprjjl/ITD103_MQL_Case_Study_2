const mongoose = require("mongoose");

const TrashSchema = new mongoose.Schema({
    height: {
        type: Number,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});
