const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const TrashModel = require('./models/Trash');

const trashRoutes = require('./routes/trashRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();
app.use(cors());
app.use(express.json());

const port = 3001;
mongoose.connect('mongodb://127.0.0.1/case_study2_db')
    .then(db => app.listen(port, () => console.log(`Server is running on port ${port}`)))
    .catch(err => console.log(err));

app.use(trashRoutes);
app.use(analyticsRoutes);

app.get('/connect/:id', async (req, res) => {
    const { id } = req.params;
    const trash = await TrashModel.findById(id);
    if (!trash) {
        return res.status(404).json({ message: 'Trash not found' });
    }
    res.status(200).json({ message: `Trash ${id} connected` });
});
