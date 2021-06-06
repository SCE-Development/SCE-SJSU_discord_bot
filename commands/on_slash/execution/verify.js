const { OK, BAD_REQUEST, UNAUTHORIZED, NOT_FOUND } = require('../../../config').STATUS_CODES
const { ApiResponse } = require("../../../util/api_response")
const { base_url } = require("../../../config")
const axios = require("axios")

async function get_database_user(discordID) {
    let status = new ApiResponse();
    await axios.post(`${base_url}/api/verifiedUser/getUser`, { discordID })
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

async function get_temp_user(discordID) {
    let status = new ApiResponse();
    await axios.get(`${base_url}/api/TempUser/find_tempUser/${discordID}`)
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

async function add_to_tempUser(obj) {
    let status = new ApiResponse();
    await axios.post(`${base_url}/api/TempUser/add_tempUser`, obj )
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

        if (database_res.code == NOT_FOUND && tempUser_res.code == NOT_FOUND) {
            let object = {
                id: user.id,
                username: user.username,
                discriminator: user.discriminator,
            }
            const addtemp_res = await add_to_tempUser(object)
            console.log(addtemp_res)
            console.log(addtemp_res.data)
            if (!addtemp_res.error) {
                console.log(addtemp_res.data)
            }
        }





        //DM user private
        user.send(`Hello, you use`).catch(console.error);
        //Reply in server
        // client.api.interactions(interaction.id, interaction.token).callback.post({
        //     data: {
        //         type: 3, //https://discord.com/developers/docs/interactions/slash-commands#applicationcommandoptiontype
        //         data: {
        //             content: "Hello world!!! check your DM"
        //         }
        //     }
        // })
    }
}
