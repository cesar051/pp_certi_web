const SQLScripts = require('../db/SQLScripts')
const stringValidator = require('../objects/stringValidator')
const sql = require('mssql');
const dbDefaultQuery = require('../db/dbDefaultQuery')
const { USER_STATES, ERROR_MESSAGES } = require('../constants')

function isKeyInUserStates(key) {
    return USER_STATES.hasOwnProperty(key);
}

module.exports.updateUserState = (req, res) => {

    const userIdToUpdate = req.body.userIdToUpdate
    const newUserState = req.body.newUserState

    const SQLscriptupdateUserState = SQLScripts.scriptUpdateUserState
    const queryInputs = [
        {
            name: 'userIdToUpdate',
            type: sql.Int,
            value: userIdToUpdate
        },
        {
            name: 'newUserState',
            type: sql.VarChar,
            value: newUserState
        },
    ]

    function callBackFunctionupdateUserState(response) {
        if (response && response.recordsets) {
            res.json({ statusCode: 200, message: "success", data: response.recordsets })

        } else {
            return res.status(500).json(ERROR_MESSAGES['error interno']);
        }
    }

    if (!stringValidator.isString(newUserState) ||
        !stringValidator.stringIsNumericOrNumber(userIdToUpdate) ||
        !isKeyInUserStates(newUserState)) {
        return res.status(401).json(ERROR_MESSAGES['Bad Request']);
    }

    dbDefaultQuery.dbDefaultQuery(SQLscriptupdateUserState, queryInputs, callBackFunctionupdateUserState, res);
}