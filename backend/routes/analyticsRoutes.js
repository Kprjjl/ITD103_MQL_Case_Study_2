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
            let dateParts = {};
            switch (unit) {
                case 'minute':
                    dateParts = {
                        year: { $year: '$timestamp' },
                        month: { $month: '$timestamp' },
                        day: { $dayOfMonth: '$timestamp' },
                        hour: { $hour: '$timestamp' },
                        minute: { $minute: '$timestamp' }
                    };
                    break;
                case 'hour':
                    dateParts = {
                        year: { $year: '$timestamp' },
                        month: { $month: '$timestamp' },
                        day: { $dayOfMonth: '$timestamp' },
                        hour: { $hour: '$timestamp' }
                    };
                    break;
                case 'day':
                    dateParts = {
                        year: { $year: '$timestamp' },
                        month: { $month: '$timestamp' },
                        day: { $dayOfMonth: '$timestamp' }
                    };
                    break;
                case 'week':
                    dateParts = {
                        isoWeekYear: { $isoWeekYear: '$timestamp' },
                        isoWeek: { $isoWeek: '$timestamp' }
                    };
                    break;
                case 'month':
                    dateParts = {
                        year: { $year: '$timestamp' },
                        month: { $month: '$timestamp' }
                    };
                    break;
                case 'year':
                    dateParts = {
                        year: { $year: '$timestamp' }
                    };
                    break;
                default:
                    throw new Error('Invalid time unit');
            }

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

        const validUnits = ['minute', 'hour', 'day', 'week', 'month', 'year'];
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
