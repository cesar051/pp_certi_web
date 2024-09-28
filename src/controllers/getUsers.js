const SQLScripts = require('../db/SQLScripts')
const sql = require('mssql');
const dbDefaultQuery = require('../db/dbDefaultQuery');
const { ERROR_MESSAGES } = require('../constants');

module.exports.getUsers = (req, res) => {

    const quantity_per_page = req.body.quantity_per_page
    const page_number = req.body.page_number

    const initial_offset = quantity_per_page * page_number

    const SQLscriptGetUsers = SQLScripts.scriptGetUsersWithPagination;//SQLScripts.scriptVerifyUserPassword
    const queryInputs = [
        {
            name: 'initial_offset',
            type: sql.Int,
            value: initial_offset
        },
        {
            name: 'quantity_per_page',
            type: sql.Int,
            value: quantity_per_page
        },
    ]

    function callBackFunctionGetUsers(response) {
        if (response && response.recordsets) {
            //res.json({ statusCode: 200, message: "success", data: response.recordsets })
            let returnData = { statusCode: 200, message: "success", data: response.recordsets }
            getNumberOfUsers(returnData)
        } else {
            return res.status(500).json(ERROR_MESSAGES['error interno']);
        }
    }

    function getNumberOfUsers(returnData) {
        const SQLscriptGetUsersNumber = SQLScripts.scriptGetTotalNumberOfUsers;//SQLScripts.scriptVerifyUserPassword
        const queryInputs = []

        function callBackFunctionGetUserNumber(response, extraCallBackParams) {
            if (response && response.recordsets) {
                extraCallBackParams.NumberOfUsers = response.recordset[0].cantidad_usuarios
                res.json(extraCallBackParams)
            } else {
                return res.status(500).json(ERROR_MESSAGES['error interno']);
            }
        }

        dbDefaultQuery.dbDefaultQuery(SQLscriptGetUsersNumber, queryInputs, callBackFunctionGetUserNumber, res, returnData);
    }

    dbDefaultQuery.dbDefaultQuery(SQLscriptGetUsers, queryInputs, callBackFunctionGetUsers, res);
}