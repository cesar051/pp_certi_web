const getTokenFromHeader = require("./getTokenFromHeader");
const { verifyAccessToken } = require("./verifyToken");

function authenticate(req, res, next) {
    console.log("autenticando")
    const token = getTokenFromHeader(req.headers);
    if (token) {
        const decoded = verifyAccessToken(token);
        if (decoded) {
            console.log("decodificado: " + decoded)
            user = decoded.user
            req.user = user;
            console.log("duardado " + req.user)
            next();
        } else {
            res.status(401).send('unauthorized');
        }
    } else {
        res.status(401).send('no token provided');
    }
}

module.exports = authenticate