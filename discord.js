require('dotenv').config();
const Discord = require('discord.js');
const bot = new Discord.Client();
bot.commands = new Discord.Collection(); // defining commands collection 
const botCommands = require('./commands');
const TOKEN = process.env.DISCORD_BOT_TOKEN;

Object.keys(botCommands).map(key => {
    bot.commands.set(botCommands[key].name, botCommands[key]); // set function accepts command's name & object
})

bot.login(TOKEN); // pass token to login function to access bot 

bot.on('ready', () => {
    console.info(`Logged in as ${bot.user.tag}`);
})

bot.on('message', msg => {
    const args = msg.content.split(/ +/); // split by whitespaces 

    const commands = args.shift().toLowerCase(); 
    console.info(`Called commands: ${commands}`); 
    
    if(!bot.commands.has(commands)) { // checks if command exists 
        return;  // command does not exist
    }

    try {
        bot.commands.get(commands).execute(msg, args); 
    } catch (error) {
        console.error(error); 
        msg.reply('an error occurred while trying to execute command');
    }
})



