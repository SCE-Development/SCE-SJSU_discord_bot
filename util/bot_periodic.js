const {ApiResponse} = require('./api_response')
const axios = require('axios')
const {api_url, discord_api_url, axios_header_config} = require('../config')

async function get_database_users() {
    let status = new ApiResponse();
    await axios.get(`${api_url}/api/VerifiedUser/getAllUsers`)
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

//Remove role and remove user from Database
async function unverifyUsers(users){
    for (const user of users) {
        for (guild of user.discordGuilds) {
            let roleID = await getRoleID(guild)
            roleID = roleID.data ? roleID.data.id : null
            await removeRole(user.discordID, guild, roleID)
        }
        await delete_database_user({
            email: user.email,
            discordID: user.discordID
        })
    }
}

var reset = false
setInterval(async function(){
    let currentMonth = (new Date().getMonth()) + 1
    //check current date
    if (currentMonth == 1 || currentMonth == 7 && new Date().getDate() == 1) {
        reset = true
    }else {
        reset = false
    }
    //Execute during break of every semester
    if (currentMonth == 1 || currentMonth == 7 && reset) {
        let status = await get_database_users()
        if (status.code == 200) {
            await unverifyUsers(status.data)
            reset = false
        }
    }
}, 24*60*60*1000)//wait 24hrs