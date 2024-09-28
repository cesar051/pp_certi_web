const SQLScripts = require('../db/SQLScripts')
const sql = require('mssql');
const dbDefaultQuery = require('../db/dbDefaultQuery');
const getTokenFromHeader = require('../auth/getTokenFromHeader');
const { verifyRefreshToken } = require('../auth/verifyToken');
const { generateAccessToken } = require('../auth/generateTokens');
const { ERROR_MESSAGES } = require('../constants');

module.exports.refreshToken = (req, res) => {

    const refreshToken = getTokenFromHeader(req.headers)
    const SQLGetTokenFromDB = SQLScripts.scriptGetToken;

    function callBackGetToken(result, extraParams) {
        if (result && result.recordset && result.recordset[0]) {
            //console.log(result);

            const payload = verifyRefreshToken(refreshToken)
            if (payload) {
                console.log("new token ");

                console.log(payload);

                const accessToken = generateAccessToken(payload.user)
                return res.json({ statusCode: 200, message: "accede", accessToken: accessToken })
            } else {
                return res.status(401).json(ERROR_MESSAGES['unauthorized']);
            }
        } else {
            res.status(401).json(ERROR_MESSAGES['unauthorized']);
        }
    }

    if (refreshToken) {
        const queryInputs = [
            {
                name: 'token',
                type: sql.VarChar,
                value: refreshToken
            }
        ]
        const extraCallBackParams = {}
        dbDefaultQuery.dbDefaultQuery(SQLGetTokenFromDB, queryInputs, callBackGetToken, res, extraCallBackParams);
    } else {
        return res.status(401).json(ERROR_MESSAGES['unauthorized']);
    }
}