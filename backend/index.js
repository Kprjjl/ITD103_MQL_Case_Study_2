const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const trashRoutes = require('./routes/trashRoutes');

const app = express();
app.use(cors());
app.use(express.json());

const port = 3001;
mongoose.connect('mongodb://127.0.0.1/case_study2_db')
    .then(db => app.listen(port, () => console.log(`Server is running on port ${port}`)))
    .catch(err => console.log(err));

app.use(trashRoutes);

app.get('/', (req, res) => {
    console.log('Hello World');
});
