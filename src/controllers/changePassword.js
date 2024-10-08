const SQLScripts = require('../db/SQLScripts')
const sql = require('mssql');
const dbDefaultQuery = require('../db/dbDefaultQuery');
const { checkOTPValid, deleteOTP, verifyOPTEqualsHashOPT, increaseOTPTries } = require('../objects/OTPManager');
const { ERROR_MESSAGES } = require('../constants');
const stringValidator = require('../objects/stringValidator');
const { hashPassword } = require('../objects/passwordManager');

module.exports.changePassword = (req, res) => {

    const email = req.body.email
    const OTPCode = req.body.OTPCode
    const password = req.body.password

    function changeDBPassword(OPTInfo, hashedPassword) {
        const SQLUpdateUserPassword = SQLScripts.scriptUpdateUserPassword
        const queryInputs = [
            {
                name: 'clave',
                type: sql.VarChar,
                value: hashedPassword
            },
            {
                name: 'userId',
                type: sql.Int,
                value: OPTInfo.user_id
            },
            {
                name: 'correo',
                type: sql.VarChar,
                value: email
            },
        ]

        function callBackFunctionUpdayeUserPassword(response) {

            if (response) {

                function responseOnsuccess(response) {
                    res.json({ statusCode: 200, message: "success", data: response.recordsets })
                }
                //getOTPinfo()
                deleteOTP(OPTInfo, responseOnsuccess, res)

            } else {
                return res.status(500).json(ERROR_MESSAGES['error interno']);
            }
        }

        dbDefaultQuery.dbDefaultQuery(SQLUpdateUserPassword, queryInputs, callBackFunctionUpdayeUserPassword, res);
    }

    function getOTPinfo() {

        const SQLscriptGetOTPInfo = SQLScripts.scriptGetOTPInfo//SQLScripts.scriptGetUserBasicInfo;//SQLScripts.scriptVerifyUserPassword
        const queryInputs = [
            {
                name: 'correo',
                type: sql.VarChar,
                value: email
            },
        ]
        function callBackFunctionGetOTPInfo(response) {

            if (response && response.recordset && response.recordset.length === 1) {

                if (checkOTPValid(response.recordset[0])) {

                    if (verifyOPTEqualsHashOPT(OTPCode, response.recordset[0].otp_hash)) {

                        hashPassword(password, (err, hashedPassword) => {
                            if (err) {
                                return res.status(500).json(ERROR_MESSAGES['error interno']);
                            }
                            changeDBPassword(response.recordset[0], hashedPassword)

                        });

                    } else {
                        function responseOnsuccess(response) {
                            return res.json(ERROR_MESSAGES['invalid code'])
                        }
                        increaseOTPTries(response.recordset[0], responseOnsuccess, res)
                    }

                } else {

                    function responseOnsuccess(response) {
                        return res.status(500).json(ERROR_MESSAGES['error interno']);
                    }
                    //getOTPinfo()
                    deleteOTP(response.recordset[0], responseOnsuccess, res)
                    //res.status(400).send('otp invalido');
                }

            } else {
                return res.status(500).json(ERROR_MESSAGES['error interno']);
            }
        }

        dbDefaultQuery.dbDefaultQuery(SQLscriptGetOTPInfo, queryInputs, callBackFunctionGetOTPInfo, res);

    }

    if (stringValidator.validateMail(email) &&
        stringValidator.validateLength(OTPCode, 6, 6) &&
        stringValidator.validatePassword(password)) {
        getOTPinfo()
    }
    else {
        console.log("este")
        return res.status(400).json(ERROR_MESSAGES['Bad Request'])
    }



}