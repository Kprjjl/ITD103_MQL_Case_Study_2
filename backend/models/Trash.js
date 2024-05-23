const mongoose = require("mongoose");

const stateOptions = ["Empty", "Quarter", "Half", "Three-Quarter", "Full"]

const getStateName = (percentage) => {
    if (percentage >= 0 && percentage < 25) {
        return "Empty";
    } else if (percentage >= 25 && percentage < 50) {
        return "Quarter";
    } else if (percentage >= 50 && percentage < 75) {
        return "Half";
    } else if (percentage >= 75 && percentage < 100) {
        return "Three-Quarter";
    } else if (percentage >= 100) {
        return "Full";
    } else {
        return "Invalid percentage";
    }
};

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
        default: "Empty"
    },
    created_at: {
        type: Date,
        default: Date.now
    }
}, { _id: false });

TrashSchema.pre("save", function(next) {
    this.level_state = getStateName(this.current_level / this.height * 100);
    next();
});

const TrashModel = mongoose.model("trashes", TrashSchema);

module.exports = TrashModel;
