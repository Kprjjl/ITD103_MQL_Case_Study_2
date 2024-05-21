const express = require('express');
const router = express.Router();
const TrashLevelModel = require('../models/TrashLevel');
const TrashModel = require('../models/Trash');

// ------------------- Trash CRUD -------------------

router.get('/trash', async (req, res) => {
    const trash = await TrashModel.find();
    res.json(trash);
});

router.post('/trash', async (req, res) => {
    const { height } = req.body;
    const trash = new TrashModel({ height });
    await trash.save();
    res.json(trash);
});

router.put('/trash/:id', async (req, res) => {
    const { id } = req.params;
    const { height } = req.body;
    await TrashModel.findByIdAndUpdate(id, { height });
    res.json({ message: 'Trash updated' });
});

router.delete('/trash/:id', async (req, res) => {
    const { id } = req.params;
    await TrashModel.findByIdAndDelete(id);
    res.json({ message: 'Trash deleted' });
});

// ------------------- Trash Level -------------------

router.get('/trash-level', async (req, res) => {
    const trashLevel = await TrashLevelModel.find();
    res.json(trashLevel);
});

router.post('/trash-level', async (req, res) => {
    const { trash, trash_level } = req.body;
    const trashLevel = new TrashLevelModel({ trash, trash_level });
    await trashLevel.save();
    res.json(trashLevel);
});

// ------------------- Trash Level by Trash -------------------

router.get('/trash/:id/trash-level', async (req, res) => {
    const { id } = req.params;
    const trashLevel = await TrashLevelModel.find({ trash: id });
    res.json(trashLevel);
});

// trash level per day by trash
router.get('/trash/:id/trash-level-per-day', async (req, res) => {
    const { id } = req.params;
    const trashLevel = await TrashLevelModel.find({ trash: id });
    const trashLevelPerDay = trashLevel.reduce((acc, curr) => {
        const date = curr.timestamp.toISOString().split('T')[0];
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(curr);
        return acc;
    }, {});
    res.json(trashLevelPerDay);
});

module.exports = router;
