const mongoose = require("mongoose");

const stateOptions = ["full", "empty", "half", "quarter", "three-quarter"]

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
    level_state: {
        type: String,
        enum: stateOptions,
        default: "empty"
    },
    created_at: {
        type: Date,
        default: Date.now
    }
}, { _id: false });

TrashSchema.pre("save", function(next) {
    if (this.current_level === 0) {
        this.level_state = "empty";
    } else if (this.current_level === this.height) {
        this.level_state = "full";
    } else if (this.current_level >= this.height / 4) {
        this.level_state = "quarter";
    } else if (this.current_level >= this.height / 2) {
        this.level_state = "half";
    } else if (this.current_level >= 3 * this.height / 4) {
        this.level_state = "three-quarter";
    }
    next();
});

const TrashModel = mongoose.model("trashes", TrashSchema);

module.exports = TrashModel;
