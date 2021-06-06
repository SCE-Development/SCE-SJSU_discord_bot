let api_url = "http://localhost:8080"

let frontend_url = "http://localhost:3000"

const STATUS_CODES = {
    OK: 200,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409
};

module.exports = {api_url,frontend_url,STATUS_CODES}