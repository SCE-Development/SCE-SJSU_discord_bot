
/**
 * There are 2 servers in here: discord and express
 * run with:
 * `node bot\&server.js`
 *  or
 * `nodemon bot\&server.js`
 */


/**
 * fake database
 */
 let database = {}




/**
 * Discord bot
 */

const Discord = require('discord.js');

require('dotenv').config();

const client = new Discord.Client();

client.login(process.env.DISCORD_BOT_TOKEN);

client.on('ready', () => console.log('The Bot is ready!'));

client.on('message', (msg) => {
  if (msg.content === 'ping') {
    msg.reply("pong")
  }
});

client.on('message', (msg) => {
  if (msg.content === 'verify') {
    let user = `${msg.author.username}#${msg.author.discriminator}`
    if (user in database){
      msg.reply(`you are verified`);

      let role = msg.member.guild.roles.cache.find(role => role.name === "verified");
      msg.guild.members.cache.get(msg.author.id).roles.add(role).catch((err)=>{console.log(err)});
    }
    else{
      msg.reply(`please verify at http://localhost:3000/${msg.author.username.replace(" ", '%20')}/${msg.author.discriminator}`);
    }
  }
});




/**
 * Express Backend server
 */

//Google auth ID
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const cors = require('cors');
const {OAuth2Client} = require('google-auth-library');
const gg = new OAuth2Client(CLIENT_ID);

//google cerifying token function
async function verify(token) {
  const ticket = await gg.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  const userid = payload['sub'];
  console.log(userid)
  console.log('done')
}

//express setting
var express = require('express');
const bodyParser = require('body-parser');
var app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

//verify url - post request
app.post('/verify', (req, res) => {
    token = req.body.response.tokenId

    verify(token).catch(()=>{
      return res.status(400).send({success: false})
    });
    database[req.body.userID] = req.body.response.profileObj
    console.log(database)
    return res.status(200).send({success: true})
})

//launch server
var server = app.listen(8081, function () {
    var port = server.address().port
    console.log("Example app listening at http://localhost:%s", port)
 })