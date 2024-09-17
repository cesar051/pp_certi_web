const getTokenFromHeader = require("./getTokenFromHeader");
const { verifyAccessToken } = require("./verifyToken");
const dbDefaultQuery = require('../db/dbDefaultQuery')
const sql = require('mssql');

function isAdmin(req, res, next) {

    const checkAdmin = (user) => {

        console.log("llegaUser");
        console.log(user.user.userId);

        const SQLscriptGetUserPerfil = `SELECT perfil FROM wa_usuarios WHERE id= @userId
        `;//SQLScripts.scriptVerifyUserPassword
        const queryInputs = [
            {
                name: 'userId',
                type: sql.Int,
                value: user.user.userId
            }
        ]

        function checkAdminCallBack(response) {
            if (response && response.recordset) {
                console.log(response)
                if (response.recordset[0].perfil === '1') {
                    next();
                } else {
                    res.status(401).send('unauthorized');
                }
            } else {
                res.status(500).send('Error al realizar la consulta.');
            }
        }

        dbDefaultQuery.dbDefaultQuery(SQLscriptGetUserPerfil, queryInputs, checkAdminCallBack, res);
    }

    console.log("autenticando")
    const token = getTokenFromHeader(req.headers);
    if (token) {
        const decoded = verifyAccessToken(token);
        if (decoded) {
            console.log("decodificado: " + decoded)
            user = decoded.user
            req.user = user;
            console.log("duardado " + req.user)
            checkAdmin(user)
            //next();
        } else {
            res.status(401).send('unauthorized');
        }
    } else {
        res.status(401).send('no token provided');
    }
}

module.exports = isAdmin