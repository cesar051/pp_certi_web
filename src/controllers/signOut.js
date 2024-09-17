const { sqli, getConnection } = require('../db/dbConnection')
const jwt = require('jsonwebtoken')
const SQLScripts = require('../db/SQLScripts')
const stringValidator = require('../objects/stringValidator')
const sql = require('mssql');
const dbDefaultQuery = require('../db/dbDefaultQuery')
const getTokenFromHeader = require('../auth/getTokenFromHeader');

require('dotenv').config({ path: './../.env' })

module.exports.signOut = (req, res) => {

    const refreshToken = getTokenFromHeader(req.headers)

    const SQLscriptDEleteToken = SQLScripts.scriptDeleteRefreshToken;//SQLScripts.scriptVerifyUserPassword
    const queryInputs = [
        {
            name: 'token',
            type: sql.VarChar,
            value: refreshToken
        },
    ]

    function callBackFunctionDeleteToken(response) {
        if (response && response.recordsets) {
            res.json({ statusCode: 200, message: "success", data: response.recordsets })
        } else {
            res.status(500).send('Error al realizar la consulta.');
        }
    }

    dbDefaultQuery.dbDefaultQuery(SQLscriptDEleteToken, queryInputs, callBackFunctionDeleteToken, res);
}