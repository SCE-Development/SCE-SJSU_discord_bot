require('dotenv');
const {OAuth2Client} = require('google-auth-library');
const gg = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function verify(token) {
    const ticket = await gg.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    return {payload, userid};
  }

module.exports = {verify};