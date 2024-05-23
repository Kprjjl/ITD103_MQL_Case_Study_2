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

router.get('/trash-level/:id/:unit', async (req, res) => {
    try {
        const { id, unit } = req.params;

        const groupBy = (unit) => {
            const dateParts = {
                year: { $year: '$timestamp' }
            };

            if (unit !== 'year') dateParts.month = { $month: '$timestamp' };
            if (unit === 'day' || unit === 'hour' || unit === 'minute') dateParts.day = { $dayOfMonth: '$timestamp' };
            if (unit === 'hour' || unit === 'minute') dateParts.hour = { $hour: '$timestamp' };
            if (unit === 'minute') dateParts.minute = { $minute: '$timestamp' };

            return [
                { $match: { 'metadata.trash_id': id } },
                { $sort: { timestamp: 1 } },
                {
                    $group: {
                        _id: { $dateFromParts: dateParts },
                        averageFillLevel: { $avg: '$trash_level' }
                    }
                },
                { $sort: { '_id': 1 } }
            ];
        };

        const validUnits = ['minute', 'hour', 'day', 'month', 'year'];
        if (!validUnits.includes(unit)) {
            return res.status(400).json({ message: 'Invalid time unit parameter' });
        }

        const trashLevels = await TrashLevelModel.aggregate(groupBy(unit));

        res.json(trashLevels);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
