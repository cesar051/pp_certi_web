const SQLScripts = require('../db/SQLScripts')
const stringValidator = require('../objects/stringValidator')
const sql = require('mssql');
const dbDefaultQuery = require('../db/dbDefaultQuery')
const { generateAccessToken, generateRefreshToken } = require('../auth/generateTokens');
const { ERROR_MESSAGES } = require('../constants');
const argon2 = require('argon2');
const { hashPassword, comparePassword } = require('../objects/passwordManager');

module.exports.userLogin = (req, res) => {

    const email = req.query.userEmail
    const pass = req.query.userPassword
    console.log(email, pass);
    const consulta = SQLScripts.scriptVerifyUserPassword
    const SQLUploadRefreshToken = SQLScripts.scriptInsertRefreshToken;

    function validateParams(email, pass) {
        if (email && pass &&
            stringValidator.validateMail(email) &&
            stringValidator.validateLength(pass, 1, 80) &&
            stringValidator.validatePassword(pass)) {
            getUserId()
        }
        else {
            return res.status(400).json(ERROR_MESSAGES['Bad Request'])
        }
    }

    function callBackFunctionGetUserId(result) {

        if (result && result.recordset && result.recordset.length > 0) {
            JWTSignUser(result.recordset[0].id,
                result.recordset[0].nombres,
                result.recordset[0].celular,
                result.recordset[0].correo,
                result.recordset[0].nit,
                result.recordset[0].perfil)

        } else {
            return res.status(400).json(ERROR_MESSAGES['wrong user/password'])
        }
    }

    function callBackVerifyCorrectPassword(result) {

        if (result && result.recordset && result.recordset.length > 0) {

            comparePassword(pass, result.recordset[0].clave, (err, isMatch) => {
                if (err) {
                    return res.status(500).json(ERROR_MESSAGES['error interno']);
                }
                if (isMatch) {
                    delete result.recordset[0].clave;
                    callBackFunctionGetUserId(result);
                } else {
                    return res.status(400).json(ERROR_MESSAGES['wrong user/password'])
                }
            });

        } else {
            return res.status(400).json(ERROR_MESSAGES['wrong user/password'])
        }
    }

    function getUserId() {
        const queryInputs = [
            {
                name: 'correo',
                type: sql.VarChar,
                value: email
            }
        ]
        dbDefaultQuery.dbDefaultQuery(consulta, queryInputs, callBackVerifyCorrectPassword, res);

    }

    function callBackUploadRefreshTokenToDB(result, extraCallBackParams) {
        if (result && result.recordset[0]) {
            res.json({
                statusCode: 200,
                message: "accede",
                accessToken: extraCallBackParams.accessToken,
                refreshToken: extraCallBackParams.refreshToken,
                userId: extraCallBackParams.userId,
                nombres: extraCallBackParams.nombres,
                celular: extraCallBackParams.celular,
                correo: extraCallBackParams.correo,
                nit: extraCallBackParams.nit,
                perfil: extraCallBackParams.perfil,
            })
        } else {
            return res.status(400).json(ERROR_MESSAGES['wrong user/password'])
        }
    }

    function JWTSignUser(userId, nombres, celular, correo, nit, perfil) {

        const accessToken = generateAccessToken({ userId: userId });

        const refreshToken = generateRefreshToken({ userId: userId });

        const queryInputs = [
            {
                name: 'token',
                type: sql.VarChar,
                value: refreshToken
            }
        ]
        const extraCallBackParams = {
            accessToken: accessToken,
            refreshToken: refreshToken,
            userId: userId,
            nombres: nombres,
            celular: celular,
            correo: correo,
            nit: nit,
            perfil: perfil,
        }
        dbDefaultQuery.dbDefaultQuery(SQLUploadRefreshToken, queryInputs, callBackUploadRefreshTokenToDB, res, extraCallBackParams);
    }
    validateParams(email, pass);
}