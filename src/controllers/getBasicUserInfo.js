const { sqli, getConnection } = require('../db/dbConnection')
const jwt = require('jsonwebtoken')
const SQLScripts = require('../db/SQLScripts')
const stringValidator = require('../objects/stringValidator')
const sql = require('mssql');
const dbDefaultQuery = require('../db/dbDefaultQuery')

require('dotenv').config({ path: './../.env' })

module.exports.getBasicUserInfo = (req, res) => {

    const userId = req.user.user.userId
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
            res.status(500).send('Error al realizar la consulta.');
        }
    }

    dbDefaultQuery.dbDefaultQuery(SQLscriptGetUserBasicInfo, queryInputs, callBackFunctionGetUsers, res);

}