const { sqli, getConnection } = require('../db/dbConnection')
const jwt = require('jsonwebtoken')
const SQLScripts = require('../db/SQLScripts')
const stringValidator = require('../objects/stringValidator')
const sql = require('mssql');
const dbDefaultQuery = require('../db/dbDefaultQuery');
const { checkOTPValid, deleteOTP, verifyOPTEqualsHashOPT, increaseOTPTries } = require('../objects/OTPManager');

require('dotenv').config({ path: './../.env' })

module.exports.changePassword = (req, res) => {

    const email = req.body.email
    const OTPCode = req.body.OTPCode
    const password = req.body.password

    function changeDBPassword(OPTInfo) {
        const SQLUpdateUserPassword = SQLScripts.scriptUpdateUserPassword
        const queryInputs = [
            {
                name: 'clave',
                type: sql.VarChar,
                value: password
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
            console.log("update obtiene");
            console.log(response);
            if (response) {
                console.log("update valido");
                console.log(response);
                function responseOnsuccess(response) {
                    res.json({ statusCode: 200, message: "success", data: response.recordsets })
                }
                //getOTPinfo()
                deleteOTP(OPTInfo, responseOnsuccess, res)

            } else {
                res.status(500).send('Error al realizar la consulta.');
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
            console.log("get info obtiene");

            console.log(response);
            if (response && response.recordset && response.recordset.length === 1) {
                console.log("get info pasa");
                console.log(response);

                if (checkOTPValid(response.recordset[0])) {
                    console.log("opt valido");
                    if (verifyOPTEqualsHashOPT(OTPCode, response.recordset[0].otp_hash)) {
                        console.log("opt concuerda");
                        changeDBPassword(response.recordset[0])

                    } else {
                        console.log("no concuerda incrementando");
                        console.log(response.recordset[0]);
                        function responseOnsuccess(response) {
                            res.json({ statusCode: 400, message: "invalid code" })
                        }
                        increaseOTPTries(response.recordset[0], responseOnsuccess, res)
                    }

                } else {
                    console.log("opt no valido borrando");
                    console.log(response.recordset[0]);
                    function responseOnsuccess(response) {
                        res.status(500).send('Error al realizar la consulta.');
                    }
                    //getOTPinfo()
                    deleteOTP(response.recordset[0], responseOnsuccess, res)
                    //res.status(400).send('otp invalido');
                }

            } else {
                res.status(500).send('Error al realizar la consulta.');
            }
        }

        dbDefaultQuery.dbDefaultQuery(SQLscriptGetOTPInfo, queryInputs, callBackFunctionGetOTPInfo, res);

    }

    getOTPinfo()

}