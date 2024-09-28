const getTokenFromHeader = require("./getTokenFromHeader");
const { verifyAccessToken } = require("./verifyToken");
const dbDefaultQuery = require('../db/dbDefaultQuery')
const sql = require('mssql');
const SQLScripts = require("../db/SQLScripts");
const { ERROR_MESSAGES } = require("../constants");

function isAdmin(req, res, next) {

    const checkAdmin = (user) => {

        console.log("llegaUser");
        console.log(user.userId);

        const SQLscriptGetUserPerfil = SQLScripts.scriptGetPerfilOfUser;//SQLScripts.scriptVerifyUserPassword
        const queryInputs = [
            {
                name: 'userId',
                type: sql.Int,
                value: user.userId
            }
        ]

        function checkAdminCallBack(response) {
            console.log("llega a check");
            console.log(response);

            if (response && response.recordset) {
                console.log(response)
                if (response.recordset[0].perfil === '1') {
                    next();
                } else {
                    console.log("lo saca");
                    return res.status(401).json(ERROR_MESSAGES['unauthorized']);
                }
            } else {
                return res.status(500).json(ERROR_MESSAGES['error interno']);
            }
        }

        dbDefaultQuery.dbDefaultQuery(SQLscriptGetUserPerfil, queryInputs, checkAdminCallBack, res);
    }

    console.log("autenticando admin")
    const token = getTokenFromHeader(req.headers);
    if (token) {
        const decoded = verifyAccessToken(token);
        console.log(decoded);

        if (decoded) {

            user = decoded.user
            req.user = user;

            checkAdmin(user)
        } else {
            return res.status(401).send(ERROR_MESSAGES['unauthorized']);
        }
    } else {
        return res.status(401).send(ERROR_MESSAGES['no token provided']);
    }
}

module.exports = isAdmin