const express = require('express');
const router = express.Router();
const TrashLevelModel = require('../models/TrashLevel');
const TrashModel = require('../models/Trash');
const { postTrashMiddleware } = require('../middleware/trash-middleware');

// ------------------- Trash CRUD -------------------

router.get('/trash', async (req, res) => {
    const trash = await TrashModel.find();
    res.json(trash);
});

router.post('/trash', postTrashMiddleware, async (req, res) => {
    const { device_id } = req.body;
    const trash = new TrashModel({ _id: device_id });
    await trash.save();
    res.json(trash);
});

router.put('/trash/:id', async (req, res) => {
    const { id } = req.params;
    const { height, label } = req.body;
    const trash = await TrashModel.findById(id);
    trash.height = height;
    trash.label = label;
    await trash.save();
    res.json(trash);
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
    const { trash_id, trash_level } = req.body;
    const trash = await TrashModel.findById(trash_id);
    if (!trash) {
        return res.status(404).json({ message: 'Trash not found' });
    }
    const trashLevel = new TrashLevelModel({ trash_level, metadata: { trash_id } });
    await trashLevel.save();
    res.json(trashLevel);
});

module.exports = router;
