const { sqli, getConnection } = require('../db/dbConnection')
const jwt = require('jsonwebtoken')
const SQLScripts = require('../db/SQLScripts')
const stringValidator = require('../objects/stringValidator')
const sql = require('mssql');
const dbDefaultQuery = require('../db/dbDefaultQuery');
const getTokenFromHeader = require('../auth/getTokenFromHeader');
const { verifyRefreshToken } = require('../auth/verifyToken');
const { generateAccessToken } = require('../auth/generateTokens');

require('dotenv').config({ path: './../.env' })

module.exports.refreshToken = (req, res) => {

    const refreshToken = getTokenFromHeader(req.headers)
    const SQLGetTokenFromDB = SQLScripts.scriptGetToken;

    function callBackGetToken(result, extraParams) {
        if (result && result.recordset && result.recordset[0]) {
            //console.log(result);

            const payload = verifyRefreshToken(refreshToken)
            if (payload) {
                //console.log(payload);

                const accessToken = generateAccessToken(payload)
                return res.json({ statusCode: 200, message: "accede", accessToken: accessToken })
            } else {
                res.status(401).send('unauthorized');
            }
        } else {
            res.status(401).send('unauthorized');
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
        res.status(401).send('unauthorized');
    }
}