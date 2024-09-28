const SQLScripts = require('../db/SQLScripts')
const sql = require('mssql');
const dbDefaultQuery = require('../db/dbDefaultQuery')
const getTokenFromHeader = require('../auth/getTokenFromHeader');
const { ERROR_MESSAGES } = require('../constants');

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
            return res.status(500).json(ERROR_MESSAGES['error interno']);
        }
    }

    dbDefaultQuery.dbDefaultQuery(SQLscriptDEleteToken, queryInputs, callBackFunctionDeleteToken, res);
}