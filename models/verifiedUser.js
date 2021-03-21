const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// structure of an entry in collection / document 
const schema = new Schema({
    username: String,
    googleId: String,
    email: String,
    name: String,
    givenName: String,
    familyName: String,
})

// create the model 
module.exports = mongoose.model('verifieduser', schema);