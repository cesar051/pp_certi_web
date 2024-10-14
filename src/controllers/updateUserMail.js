const SQLScripts = require('../db/SQLScripts')
const stringValidator = require('../objects/stringValidator')
const sql = require('mssql');
const dbDefaultQuery = require('../db/dbDefaultQuery')
const { ERROR_MESSAGES } = require('../constants')

module.exports.updateUserMail = (req, res) => {

    const userIdToUpdate = req.body.userIdToUpdate
    const newUserMail = req.body.newUserMail

    const SQLscriptupdateUserMail = SQLScripts.scriptUpdateUserMail
    const SQLConsultaCheckEmailNotExist = SQLScripts.scriptVerifyMailNotRegistered;

    const updateBDMail = () => {

        const queryInputs = [
            {
                name: 'userIdToUpdate',
                type: sql.Int,
                value: userIdToUpdate
            },
            {
                name: 'newUserMail',
                type: sql.VarChar,
                value: newUserMail
            },
        ]

        function callBackFunctionupdateUserMail(response) {
            if (response && response.recordsets) {
                res.json({ statusCode: 200, message: "success", data: response.recordsets })

            } else {
                return res.status(500).json(ERROR_MESSAGES['error interno']);
            }
        }

        dbDefaultQuery.dbDefaultQuery(SQLscriptupdateUserMail, queryInputs, callBackFunctionupdateUserMail, res);
    }

    const alreadyNotExistMail = (email) => {

        const callBackFunctionAlreadyNotExistEmail = (result) => {

            if (result && result.recordset) {
                if (result.recordset.length > 0) {
                    res.json({ statusCode: 400, message: "mail already exist" })
                } else {
                    updateBDMail();
                    //createNewUser();
                }
            } else {
                return res.status(500).json(ERROR_MESSAGES['error interno']);
            }
        }

        const queryInputs = [
            {
                name: 'correo',
                type: sql.VarChar,
                value: newUserMail
            }
        ]
        dbDefaultQuery.dbDefaultQuery(SQLConsultaCheckEmailNotExist, queryInputs, callBackFunctionAlreadyNotExistEmail, res);
    }

    if (!stringValidator.isString(newUserMail) ||
        !stringValidator.stringIsNumericOrNumber(userIdToUpdate) ||
        !stringValidator.validateMail(newUserMail)) {
        return res.status(401).json(ERROR_MESSAGES['Bad Request']);
    }

    alreadyNotExistMail()
}