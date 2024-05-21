require('dotenv').config();
const allowNewTrash = process.env.ALLOW_NEW_TRASH === 'true';

const postTrashMiddleware = (req, res, next) => {
    const { device_id } = req.body;
    if (!device_id) {
        return res.status(400).json({ message: 'device_id is required' });
    }
    if (!allowNewTrash) {
        return res.status(403).json({ message: 'New trash is not allowed' });
    }
    next();
};

module.exports = { postTrashMiddleware };
