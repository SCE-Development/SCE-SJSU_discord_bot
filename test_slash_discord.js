require('dotenv').config();
const Discord = require('discord.js')
const client = new Discord.Client()

//Slash command interaction
client.ws.on('INTERACTION_CREATE', async interaction => {
    //command name
    const command = interaction.data.name.toLowerCase();
    // args/params 
    const args = interaction.data.options;
    console.log(args)
    //server
    const guild = client.guilds.cache.get(interaction.guild_id);
    //get user who sent command
    const user = client.users.cache.get(interaction.member.user.id);

    if (command == 'ping'){
        //DM user private
        user.send(`hello, you used the ${interaction.data.name.toLowerCase()} command in ${guild.name} with ${args[0].name}: ${args[0].value}`)
        .catch(console.error);

        //Reply in server
        client.api.interactions(interaction.id, interaction.token).callback.post({
            data: {
                type: 3,
                data: {
                    content: "hello world!!! check your DM"
                }
            }
        })
    }

})

client.login(process.env.DISCORD_BOT_TOKEN)