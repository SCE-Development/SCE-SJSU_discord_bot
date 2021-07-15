require('dotenv').config();
const Discord = require('discord.js');
const bot = new Discord.Client();
bot.commands = new Discord.Collection(); // defining commands collection 
const {on_message_commands, on_slash_command_executions} = require('./commands/index');
const TOKEN = process.env.DISCORD_BOT_TOKEN;

Object.keys(on_message_commands).map(key => {
    bot.commands.set(on_message_commands[key].name, on_message_commands[key]); // set function accepts command's name & object
})
Object.keys(on_slash_command_executions).map(key => {
    bot.commands.set(on_slash_command_executions[key].name, on_slash_command_executions[key]); // set function accepts command's name & object
})

bot.login(TOKEN); // pass token to login function to access bot 
bot.on('ready', () => {
    console.info(`Logged in as ${bot.user.tag}`);
})

//On slash commands
bot.ws.on('INTERACTION_CREATE', async interaction => {
    //command name
    const command = interaction.data.name.toLowerCase();
    //args
    const args = interaction.data.options;
    //server/guild
    let guild = await bot.guilds.fetch(interaction.guild_id).then(guild_obj=>{
        return guild_obj
    });
    //get user who sent command
    let user = await bot.users.fetch(interaction.member.user.id).then(user_obj=>{
        return user_obj
    });
    try {
        bot.commands.get(command).execute(bot, interaction, command, args, user, guild);
    } catch (error) {
        console.error(error);
        user.send(`Hello, there was an error executing ${command} in ${guild.name}. Please try again later.`)
        .catch(console.error);
    }
})

//On messgae
//uncomment for messgae handler
// bot.on('message', msg => {
//     const args = msg.content.split(/ +/); // split by whitespaces 
//     const commands = args.shift().toLowerCase();
//     console.info(`Called commands: ${commands}`);
//     if (!bot.commands.has(commands)) { // checks if command exists 
//         return;  // command does not exist
//     }
//     try {
//         bot.commands.get(commands).execute(msg, args);
//     } catch (error) {
//         console.error(error);
//         msg.reply('an error occurred while trying to execute command');
//     }
// })

require('./util/bot_periodic')
