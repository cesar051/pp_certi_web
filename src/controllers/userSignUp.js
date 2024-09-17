const { sqli, getConnection } = require('../db/dbConnection')
const jwt = require('jsonwebtoken')
const SQLScripts = require('../db/SQLScripts')
const stringValidator = require('../objects/stringValidator')
const sql = require('mssql');
const dbDefaultQuery = require('../db/dbDefaultQuery')

module.exports.userSignUp = (req, res) => {
    const name = req.body.name
    const fechaNacimiento = req.body.fechaNacimiento
    const email = req.body.email
    const nit = req.body.nit
    const numero = req.body.numero
    const password = req.body.password

    const SQLConsultaCheckEmailNotExist = SQLScripts.scriptVerifyMailNotRegistered;
    const SQLInsertNewUser = SQLScripts.scriptInsertNewUser;

    function callBackFunctionCreateUser(result) {
        console.log(result)
        if (result) {
            res.json({ statusCode: 200, message: "success", dataInsertedId: result.recordset })
        } else {
            res.status(500).send('Error al realizar la consulta.');
        }
    }

    function createNewUser() {
        const queryInputs = [
            {
                name: 'nit',
                type: sql.Int,
                value: nit
            },
            {
                name: 'nombre',
                type: sql.VarChar,
                value: name
            },
            {
                name: 'correo',
                type: sql.VarChar,
                value: email
            },
            {
                name: 'celular',
                type: sql.VarChar,
                value: numero
            },
            {
                name: 'clave',
                type: sql.VarChar,
                value: password
            }
        ]
        dbDefaultQuery.dbDefaultQuery(SQLInsertNewUser, queryInputs, callBackFunctionCreateUser, res);
    }

    function callBackFunctionAlreadyNotExistEmail(result) {
        console.log(result)
        if (result && result.recordset) {
            if (result.recordset.length > 0) {
                res.json({ statusCode: 400, message: "mail already exist" })
            } else {
                createNewUser();
            }
        } else {
            res.status(500).send('Error al realizar la consulta.');
        }

    }

    function alreadyNotExistMail(email) {
        const queryInputs = [
            {
                name: 'correo',
                type: sql.VarChar,
                value: email
            }
        ]
        dbDefaultQuery.dbDefaultQuery(SQLConsultaCheckEmailNotExist, queryInputs, callBackFunctionAlreadyNotExistEmail, res);
    }

    if (stringValidator.validateMail(email) && stringValidator.validateLength(password, 8, 80) && stringValidator.validateLength(name, 1, 100) &&
        stringValidator.validateLength(nit, 9, 9)) {
        alreadyNotExistMail(email)
    }
    else {
        console.log("este")
        res.json({ statusCode: 400, message: "wrong user/password" })
    }
}