const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const TrashLevelModel = require('../models/TrashLevel');
const TrashModel = require('../models/Trash');
const { postTrashMiddleware } = require('../middleware/trash-middleware');
const { broadcast } = require('../websocket');

// ------------------- Trash CRUD -------------------
router.get('/trash', async (req, res) => {
    const trash = await TrashModel.find();
    res.json(trash);
});

router.post('/trash', postTrashMiddleware, async (req, res) => {
    console.log("posting");
    const { device_id } = req.body;
    const trash = new TrashModel({ _id: device_id });
    await trash.save();
    res.json(trash);
    broadcast({ type: 'NEW_TRASH_CAN', payload: trash });
});

router.put('/trash/:id', async (req, res) => {
    const { id } = req.params;
    const { height, label } = req.body;
    const trash = await TrashModel.findById(id);
    if (height) trash.height = height;
    if (label) trash.label = label;
    await trash.save();
    res.status(200).json(trash);
    broadcast({ type: 'UPDATE_TRASH_CAN', payload: trash });
});

router.delete('/trash/:id', async (req, res) => {
    const { id } = req.params;
    await TrashModel.findByIdAndDelete(id);
    res.json({ message: 'Trash deleted' });
    broadcast({ type: 'DELETE_TRASH_CAN', payload: { id } });
});

// ------------------- Trash Level -------------------
router.get('/trash-level', async (req, res) => {
    const trashLevel = await TrashLevelModel.find();
    res.json(trashLevel);
});

router.get('/trash-level/:id', async (req, res) => {
    const { id } = req.params;
    const trashLevel = await TrashLevelModel.find({ 'metadata.trash_id': id });
    const data = trashLevel.map(({ timestamp, trash_level }) => ([ timestamp, trash_level ]));
    res.json(data);
});

router.post('/trash-level', async (req, res) => {
    try {
        const { trash_id, trash_level } = req.body;
        const trash = await TrashModel.findById(trash_id);
        if (!trash) {
            return res.status(404).json({ message: 'Trash not found' });
        }
        const level = trash.height - parseInt(trash_level);
        trash.current_level = level;
        const trashLevel = new TrashLevelModel({ trash_level: level, metadata: { trash_id } });
        await trashLevel.save();
        await trash.save();
        res.json(trashLevel);
        broadcast({ type: 'NEW_TRASH_LEVEL', payload: trashLevel });
        broadcast({ type: 'UPDATE_TRASH_CAN', payload: trash });
    } catch (err) {
        console.log("Error posting trash level:", err.message);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
