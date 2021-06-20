const { OK, NOT_FOUND } = require('../../../config').STATUS_CODES
const { ApiResponse } = require("../../../util/api_response")
const { api_url } = require("../../../config")
const axios = require("axios")

/**
 * get status of server
 * @param {String} discordID 
 * @returns status obj
 */
async function get_server_status() {
  let status = new ApiResponse();
  await axios.get(`${api_url}/api/HealthCheck/status`)
    .then(result => {
      status.data = result.data;
    })
    .catch(err => {
      status.error = true;
      status.data = err;
      status.code = NOT_FOUND
    });
  return status;
}

module.exports = {
  name: "status",
  description: "Get server and bot status",
  async execute(client, interaction, command, args, user, guild) {
    const healthRes = await get_server_status()
    const embed = {
      color: 3066993,
      author: {
        name: client.user.username,
        icon_url: client.user.avatarURL()
      },
      title: "Status",
      description: "Checking status of bot and backend",
      fields: [
        { name: "Bot", value: "Connected" },
        { name: "Server", value: healthRes.code === OK ? "Connected" : "Failed" },
        {
          name: "Database", value: healthRes.code === OK
            && healthRes.data.db === OK ? "Connected" : "Failed"
        }
      ],
      timestamp: new Date(),
      footer: {
        icon_url: client.user.avatarURL(),
        text: "© SCE"
      }
    }
    await user.send({ embed }).catch(console.error);
  }
}
