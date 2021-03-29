const express = require('express');
const mongoose = require('mongoose');
const url = 'mongodb://127.0.0.1:27017/sce-sjsu-discord'; // local database
const routes = require('./api/routes/verifiedUser');

const app = express();

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

app.use(express.json()); // to parse request body 
app.use('/verifiedUser', routes);

app.listen(8080, () => {
    console.log('listening on port 8080');
})