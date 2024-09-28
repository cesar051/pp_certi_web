const SQLScripts = require('../db/SQLScripts')
const sql = require('mssql');
const dbDefaultQuery = require('../db/dbDefaultQuery');
const { ERROR_MESSAGES } = require('../constants');

module.exports.getBasicUserInfo = (req, res) => {

    const userId = req.user.userId
    console.log("entrando basic info " + userId)
    const SQLscriptGetUserBasicInfo = SQLScripts.scriptGetUserBasicInfo;//SQLScripts.scriptVerifyUserPassword
    const queryInputs = [
        {
            name: 'userId',
            type: sql.Int,
            value: userId
        },
    ]

    function callBackFunctionGetUsers(response) {
        if (response && response.recordsets) {
            console.log(response);
            res.json({ statusCode: 200, message: "success", data: response.recordsets })
        } else {
            return res.status(500).json(ERROR_MESSAGES['error interno']);
        }
    }

    dbDefaultQuery.dbDefaultQuery(SQLscriptGetUserBasicInfo, queryInputs, callBackFunctionGetUsers, res);

}