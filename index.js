const express = require('express');
const mongoose = require('mongoose');
const url = 'mongodb://127.0.0.1:27017/sce-sjsu-discord'; // local database
const routes = require('./routes');

const app = express();

mongoose.connect(url, { useNewUrlParser: true })

app.use(express.json()); // to parse request body 
app.use('/verify', routes);

app.listen(3000, () => {
    console.log('listening on port 3000');
})