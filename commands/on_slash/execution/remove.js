const { OK, BAD_REQUEST, UNAUTHORIZED, NOT_FOUND, FORBIDDEN } = require('../../../config').STATUS_CODES
const { ApiResponse } = require("../../../util/api_response")
const { api_url, discord_api_url, axios_header_config } = require("../../../config")
const axios = require("axios")

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

/**
 * @param {obj} obj {discordID, email} of user to be deleted
 * @returns status obj
 */
async function delete_database_user(obj) {
    let status = new ApiResponse();
    await axios.post(`${api_url}/api/verifiedUser/deleteUser`, obj)
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

/**
 * get role obj of guild
 * @param {String} guildID 
 * @param {String} roleToFind - defaulted by verified
 * @returns status obj
 */
async function getRoleID(guildID, roleToFind = 'verified') {
    let status = new ApiResponse();
    await axios.get(`${discord_api_url}/guilds/${guildID}/roles`, axios_header_config)
        .then(result => {
            status.data = result.data.find(role => role.name.toLowerCase() === roleToFind);
        })
        .catch(err => {
            status.error = true;
            status.data = err;
            status.code = err.response.status
        });
    return status;
}

/**
 * remove role from user
 * @param {String} userID - discord
 * @param {String} guildID
 * @param {String} roleID 
 * @returns status obj
 */
async function removeRole(userID, guildID, roleID) {
    let status = new ApiResponse();
    await axios.delete(`${discord_api_url}/guilds/${guildID}/members/${userID}/roles/${roleID}`, axios_header_config)
        .then(result => {
            status.data = result;
        })
        .catch(err => {
            status.error = true;
            status.data = err;
            status.code = err.response.status
        });
    return status;
}

module.exports = {
    name: "remove",
    description: "Remove a verified account",
    async execute(client, interaction, command, args, user, guild) {

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

        const database_res = await get_database_user(id_obj.value, id_obj.type)
        if (database_res.code === OK) {
            for (const user of database_res.data) {
                let discordGuilds = user.discordGuilds
                let discordID = user.discordID
                for (const guild of discordGuilds) {
                    let roleID = await getRoleID(guild)
                    roleID = roleID.data ? roleID.data.id : null
                    await removeRole(discordID, guild, roleID)
                }
                await delete_database_user({
                    email: user.email,
                    discordID: discordID
                })
            }
            await client.api.interactions(interaction.id, interaction.token).callback.post({
                data: {
                    type: 4,
                    data: {
                        content: `
                        **${id_obj.type}-id: ${id_obj.type == 'discord' ? `<@${id_obj.value}>` : id_obj.value}** is removed.
                        `
                    }
                }
            })
        }
        else {
            await client.api.interactions(interaction.id, interaction.token).callback.post({
                data: {
                    type: 4,
                    data: {
                        content: `
                        **${id_obj.type}-id: ${id_obj.type == 'discord' ? `<@${id_obj.value}>` : id_obj.value}** is not in database.
                        `
                    }
                }
            })
            return
        }
    }
}
