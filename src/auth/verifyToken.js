const jwt = require('jsonwebtoken')

function verifyAccessToken(token) {
    try {
        return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch {
        return null
    }
}

function verifyRefreshToken(token) {
    try {
        return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    } catch {
        return null
    }
}

module.exports = { verifyAccessToken, verifyRefreshToken }