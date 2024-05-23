const express = require('express');
const router = express.Router();
const TrashLevelModel = require('../models/TrashLevel');
const TrashModel = require('../models/Trash');

router.get('/level-states', async (req, res) => {
    try {
        const levelStates = await TrashModel.aggregate([
            { $group: { _id: '$level_state', count: { $sum: 1 } } }
        ]);
        const levelStatesArray = levelStates.map(levelState => [`${levelState._id}`, levelState.count]);
        const totalCount = levelStates.reduce((acc, levelState) => acc + levelState.count, 0);

        res.json({ levelStates: levelStatesArray, totalCount });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/average-fill-time', async (req, res) => {
    try {
        const trashLevels = await TrashLevelModel.aggregate([
            { $sort: { timestamp: 1 } },
            {
                $group: {
                    _id: '$metadata.trash_id',
                    firstTimestamp: { $first: '$timestamp' },
                    lastTimestamp: { $last: '$timestamp' },
                    totalLevels: { $sum: 1 }
                }
            },
            {
                $project: {
                    trashId: '$_id',
                    averageFillTime: { $divide: [{ $subtract: ['$lastTimestamp', '$firstTimestamp'] }, '$totalLevels'] }
                }
            }
        ]);

        res.json(trashLevels);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/peak-usage-times', async (req, res) => {
    try {
        const peakTimes = await TrashLevelModel.aggregate([
            {
                $group: {
                    _id: { hour: { $hour: '$timestamp' } },
                    averageFillLevel: { $avg: '$trash_level' }
                }
            },
            { $sort: { '_id.hour': 1 } }
        ]);

        res.json(peakTimes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
