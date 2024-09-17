const crypto = require('crypto');
const dbDefaultQuery = require('../db/dbDefaultQuery')
const sql = require('mssql');
const SQLScripts = require('../db/SQLScripts')

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

function hashOTP(OTPcode) {
    return crypto.createHash('sha256').update(OTPcode).digest('hex');
}

function createOTPExpirationDate() {
    return new Date(Date.now() + 10 * 60 * 1000);
}

function checkOTPExpirateDate(OTPInfo) {
    return !(new Date(OTPInfo.expires_at) < new Date())
}

function checkOTPMaxtries(OTPInfo) {
    return OTPInfo.number_tries <= 5
}

function checkOTPValid(OTPInfo) {
    return checkOTPExpirateDate(OTPInfo) && checkOTPMaxtries(OTPInfo)
}

function deleteOTP(OTPInfo, responseOnsuccess, res) {
    const SQLscriptDeleteOTP = SQLScripts.scriptDeleteOTPById;//SQLScripts.scriptGetUserBasicInfo;//SQLScripts.scriptVerifyUserPassword
    const queryInputs = [
        {
            name: 'otp_id',
            type: sql.Int,
            value: OTPInfo.otp_id
        },
    ]
    function callBackFunctionDeleteOTP(response) {
        console.log(response);
        if (response) {
            responseOnsuccess(response)//res.status(500).send('Error al realizar la consulta.');
        } else {
            res.status(500).send('Error al realizar la consulta.');
        }
    }

    dbDefaultQuery.dbDefaultQuery(SQLscriptDeleteOTP, queryInputs, callBackFunctionDeleteOTP, res);

}

function verifyOPTEqualsHashOPT(OPTCode, OPTHash) {
    const temHash = hashOTP(OPTCode);
    return temHash === OPTHash;
}

function increaseOTPTries(OTPInfo, responseOnsuccess, res) {
    const SQLscriptIncreaseTries = SQLScripts.scriptIncreaseOTPTries//SQLScripts.scriptDeleteOTPById;//SQLScripts.scriptGetUserBasicInfo;//SQLScripts.scriptVerifyUserPassword
    const queryInputs = [
        {
            name: 'otp_id',
            type: sql.Int,
            value: OTPInfo.otp_id
        },
    ]
    function callBackFunctionIncreaseTries(response) {
        console.log(response);
        if (response) {
            responseOnsuccess(response)//res.status(500).send('Error al realizar la consulta.');
        } else {
            res.status(500).send('Error al realizar la consulta.');
        }
    }

    dbDefaultQuery.dbDefaultQuery(SQLscriptIncreaseTries, queryInputs, callBackFunctionIncreaseTries, res);
}

module.exports = {
    generateOTP,
    hashOTP,
    createOTPExpirationDate,
    checkOTPExpirateDate,
    checkOTPMaxtries,
    checkOTPValid,
    deleteOTP,
    verifyOPTEqualsHashOPT,
    increaseOTPTries
}