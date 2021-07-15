const { ApiResponse } = require("../../../util/api_response")
const { isAllowed } = require("../../../util/discord_permissions")
const { api_url } = require("../../../config")
const axios = require("axios")
const perms = require("../model/who").permissions

/**
 * 
 * @param {String} id - id of that type 
 * @param {String} type - specify type of id (discord or email)
 * @returns status obj
 */
async function get_database_user(id, type = "discord") {
    let status = new ApiResponse();
    const obj = type === "discord" ?
        { discordID: id } : { email: id }
    await axios.post(`${api_url}/api/verifiedUser/getUser`, obj)
        .then(result => {
            status.data = result.data;
        })
        .catch(err => {
            status.error = true;
            status.data = err;
            status.code = err.response.status
        });
    return status;
}

module.exports = {
    name: "who",
    description: "Check who is a verified user",
    async execute(client, interaction, command, args, user, guild) {

        //permission check
        const isAdmin = await isAllowed(interaction.member.permissions, perms, client, interaction)
        if (!isAdmin) return

        const id_obj = {
            type: null,
            value: null
        }

        if (!args) {
            await client.api.interactions(interaction.id, interaction.token).callback.post({
                data: {
                    type: 4,
                    data: {
                        content: "Provide a DiscordID or SJSU-Email."
                    }
                }
            })
            return
        }
        else {
            for (let arg of args) {
                if (arg.name === "discord-id") {
                    id_obj.type = 'discord'
                    id_obj.value = arg.value
                    break;
                }
                else {
                    id_obj.type = 'email'
                    id_obj.value = arg.value
                    break;
                }
            }
        }

        let database_res = await get_database_user(id_obj.value, id_obj.type)
        database_res = database_res.code===200 ? database_res.data[0] : false
        await client.api.interactions(interaction.id, interaction.token).callback.post({
            data: {
                type: 4,
                data: {
                    content: database_res ? 
                    `<@${database_res.discordID}> is ${database_res.name} (${database_res.email})`
                    :
                    `Not in Database/Verified`
                }
            }
        })

    }
}
