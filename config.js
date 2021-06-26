let api_url = `http://${process.env.API_URL || localhost}:8080`

let frontend_url = process.env.FRONTEND_URL || "http://localhost:3000"

let discord_api_url = process.env.DISCORD_API_URL || "https://discord.com/api"

const STATUS_CODES = {
    OK: 200,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409
};

const axios_header_config = {
    headers: {
        Authorization: 'Bot ' + process.env.DISCORD_BOT_TOKEN,
        ContentType: 'application/json'
    }      
}

module.exports = {api_url,frontend_url,STATUS_CODES, axios_header_config, discord_api_url}