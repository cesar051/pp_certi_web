const SQLScripts = require('../db/SQLScripts')
const stringValidator = require('../objects/stringValidator')
const sql = require('mssql');
const dbDefaultQuery = require('../db/dbDefaultQuery')
const { USER_STATES, ERROR_MESSAGES } = require('../constants')

function isKeyInUserStates(key) {
    return USER_STATES.hasOwnProperty(key);
}

module.exports.getFilteredUsers = (req, res) => {

    const quantity_per_page = req.body.quantity_per_page
    const page_number = req.body.page_number
    const user_state = req.body.user_state

    const initial_offset = quantity_per_page * page_number

    const SQLscriptGetFilteredUsers = SQLScripts.scriptGetUsersWithPaginationFiltered;//SQLScripts.scriptVerifyUserPassword
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
        {
            name: 'user_state',
            type: sql.VarChar,
            value: user_state
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
        const SQLscriptGetUsersNumber = SQLScripts.scriptGetTotalNumberOfUsersFiltered;//SQLScripts.scriptVerifyUserPassword
        const queryInputs = [
            {
                name: 'user_state',
                type: sql.VarChar,
                value: user_state
            }
        ]

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

    if (!stringValidator.stringIsNumericOrNumber(quantity_per_page) ||
        !stringValidator.stringIsNumericOrNumber(page_number) ||
        !stringValidator.isString(user_state) ||
        !isKeyInUserStates(user_state)) {
        return res.status(401).json(ERROR_MESSAGES['Bad Request']);
    }

    dbDefaultQuery.dbDefaultQuery(SQLscriptGetFilteredUsers, queryInputs, callBackFunctionGetUsers, res);
}