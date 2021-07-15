const { OK, BAD_REQUEST, UNAUTHORIZED, NOT_FOUND, FORBIDDEN } = require('../../../config').STATUS_CODES
const { ApiResponse } = require("../../../util/api_response")
const { api_url, frontend_url, axios_header_config, discord_api_url } = require("../../../config")
const axios = require("axios")

/**
 * get user from database
 * @param {String} discordID 
 * @returns status obj
 */
async function get_database_user(discordID) {
    let status = new ApiResponse();
    await axios.post(`${api_url}/api/verifiedUser/getUser`, { discordID })
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
 * get tempuser obj
 * @param {String} discordID 
 * @returns status obj
 */
async function get_temp_user(discordID) {
    let status = new ApiResponse();
    await axios.get(`${api_url}/api/TempUser/find_tempUser/${discordID}`)
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
 * Add to tempUser in backend
 * @param {obj} obj - check backend api
 * @returns status obj
 */
async function add_to_tempUser(obj) {
    let status = new ApiResponse();
    await axios.post(`${api_url}/api/TempUser/add_tempUser`, obj)
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
 * edit an user obj
 * @param {obj} obj - check backend api
 * @returns status obj
 */
async function edit_database_user(obj) {
    let status = new ApiResponse();
    await axios.post(`${api_url}/api/verifiedUser/editUser`, obj)
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
 * add role to user
 * @param {String} guildID 
 * @param {String} userID - discord
 * @param {String} roleID 
 * @returns status obj
 */
async function discord_add_role(guildID, userID, roleID) {
    let status = new ApiResponse();
    await axios.put(`${discord_api_url}/guilds/${guildID}/members/${userID}/roles/${roleID}`, {}, axios_header_config)
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
    name: "verify",
    description: "Verify sjsu account",
    async execute(client, interaction, command, args, user, guild) {

        const database_res = await get_database_user(user.id)
        const tempUser_res = await get_temp_user(user.id)

        if (database_res.code === NOT_FOUND && tempUser_res.code === NOT_FOUND) {
            let object = {
                id: user.id,
                username: user.username,
                discriminator: user.discriminator,
            }
            const addtemp_res = await add_to_tempUser(object)

            if (!addtemp_res.error) {
                //DM user
                user.send(`
                Please login with SJSU at ${`${frontend_url}/discordSJSU/LoginWithGoogle/${addtemp_res.data.id}`} And try "/verify" again
                `).catch(console.error);
            }
        }
        else if (database_res.code === NOT_FOUND && tempUser_res.code === OK) {
            const tempUser_res = await get_temp_user(user.id)
            //DM user
            user.send(`
            Please login with SJSU at ${`${frontend_url}/discordSJSU/LoginWithGoogle/${tempUser_res.data.id}`} And try "/verify" again
            `).catch(console.error);
        }
        else {
            let database_user = database_res.data[0]
            if (!database_user.discordGuilds.includes(guild.id)) {
                let obj = {
                    query_email: database_user.email,
                    query_discordID: database_user.discordID,
                    guilds_flag: true,
                    newForm: {
                        discordGuilds: [...database_user.discordGuilds, guild.id]
                    }
                }
                const editUser_res = await edit_database_user(obj)
                if (editUser_res.code !== OK) {
                    user.send(`Error: Please try again or wait 15m before trying again.`).catch(console.error);
                    return
                }
            }

            const role = guild.roles.cache.find(role => role.name.toLowerCase() === "verified")
            if (!role) {
                client.api.interactions(interaction.id, interaction.token).callback.post({
                    data: {
                        type: 4,
                        data: {
                            content: `Server don't have ***Verified*** role, please notify admin`
                        }
                    }
                })
                return
            }

            const addRole_res = await discord_add_role(guild.id, user.id, role.id)
            if (addRole_res.code === OK) {
                client.api.interactions(interaction.id, interaction.token).callback.post({
                    data: {
                        type: 4,
                        data: {
                            content: `Welcome <@${user.id}>! You've been verified.`
                        }
                    }
                })
            }
            else if (addRole_res.code === FORBIDDEN) {
                client.api.interactions(interaction.id, interaction.token).callback.post({
                    data: {
                        type: 4,
                        data: {
                            content: `Bot does not have permission - please assign role with proper permission to bot.`
                        }
                    }
                })
            }

        }

    }
}
