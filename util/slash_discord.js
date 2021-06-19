require('dotenv').config();
const axios = require('axios')
const axios_config = {
    headers: {
        Authorization: 'Bot ' + process.env.DISCORD_BOT_TOKEN,
        ContentType: 'application/json'
    }      
}

/**
 * look at document
 * https://discord.com/developers/docs/interactions/slash-commands
 * @param {Object} commandData 
 * @returns 
 */
async function create_slash_commands(commandData, guild_id=null){
    const apiEndpoint = guild_id ? 
    `https://discord.com/api/v8/applications/${process.env.DISCORD_BOT_APP_ID}/guilds/${guild_id}/commands`
    : `https://discord.com/api/v8/applications/${process.env.DISCORD_BOT_APP_ID}/commands`
    let id = null
    await axios.post(apiEndpoint,commandData,axios_config)
    .then(res=>{
        console.log(res.data)
        id = res.data.id
    })
    .catch(err=>console.log(err))
    return id
}

/**
 * Need to be string
 * @param {String} slash_command_id 
 */
async function delete_slash_commands(slash_command_id, guild_id=null){
    const apiEndpoint = guild_id ? 
    `https://discord.com/api/v8/applications/${process.env.DISCORD_BOT_APP_ID}/guilds/${guild_id}/commands/${slash_command_id}`
    : `https://discord.com/api/v8/applications/${process.env.DISCORD_BOT_APP_ID}/commands/${slash_command_id}`
    await axios.delete(apiEndpoint,axios_config)
    .then(res=>{
        console.log("Success Deleted ", slash_command_id)
    })
    .catch(err=>console.log(err))
}

module.exports={create_slash_commands, delete_slash_commands}
