const mongoose = require('mongoose');

const TrashLevelSchema = new mongoose.Schema({
    trash:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trash',
        required: true
    },
    trash_level: {
        type: Number,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const TrashLevelModel = mongoose.model('TrashLevel', TrashLevelSchema);

module.exports = TrashLevelModel;
