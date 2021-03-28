const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// structure of an entry in collection / document 
const schema = new Schema({
    discordID: {
        type: Object,
        required: true
    },
    discordID: {
        type: Object,
        required: true
    },
    googleId: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    givenName: {
        type: String,
        required: false
    },
    familyName: {
        type: String,
        required: false
    }
})

// create the model 
module.exports = mongoose.model('verifiedUser', schema);
