const mongoose = require('mongoose');

const TrashLevelSchema = new mongoose.Schema(
    {
        trash_level: {
            type: Number,
            required: true
        },
        timestamp: {
            type: Date,
            default: Date.now
        },
        metadata: {
            trash_id:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Trash',
                required: true
            }
        }
    },
    {
        timeseries: {
            timeField: 'timestamp',
            metaField: 'metadata',
            // granularity: 'minutes',
        },
        // expireAfterSeconds: 86400
    }
);

const TrashLevelModel = mongoose.model('TrashLevel', TrashLevelSchema);

module.exports = TrashLevelModel;
