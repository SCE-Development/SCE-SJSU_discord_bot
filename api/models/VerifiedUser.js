const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// structure of an entry in collection / document 
const schema = new Schema({
    discordID: {
        type: String, 
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
    },
    discordGuilds: {
        type: [String],
        default: [],
        required: true
    }
})

// create the model 
module.exports = mongoose.model('verifiedUser', schema);
