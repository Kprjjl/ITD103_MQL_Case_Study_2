const TrashModel = require('../models/Trash');
require('dotenv').config();
const allowNewTrash = process.env.ALLOW_NEW_TRASH === 1;

const postTrashMiddleware = (req, res, next) => {
    const { device_id } = req.body;
    if (!device_id) {
        return res.status(400).json({ message: 'device_id is required' });
    }
    const trash = TrashModel.findById(device_id);
    if (trash) {
        return res.status(400).json({ message: 'Device already registered' });
    }
    if (!allowNewTrash) {
        return res.status(403).json({ message: 'New trash is not allowed' });
    }
    next();
};

module.exports = { postTrashMiddleware };
