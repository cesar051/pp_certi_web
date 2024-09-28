const { ERROR_MESSAGES } = require("../constants");
const getTokenFromHeader = require("./getTokenFromHeader");
const { verifyAccessToken } = require("./verifyToken");

function authenticate(req, res, next) {
    console.log("autenticando")
    const token = getTokenFromHeader(req.headers);
    if (token) {
        const decoded = verifyAccessToken(token);
        if (decoded) {

            user = decoded.user
            req.user = user;

            next();
        } else {
            return res.status(401).json(ERROR_MESSAGES['unauthorized']);
        }
    } else {
        return res.status(401).json(ERROR_MESSAGES['no token provided']);
    }
}

module.exports = authenticate