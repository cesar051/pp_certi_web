const SQLScripts = require('../db/SQLScripts')
const stringValidator = require('../objects/stringValidator')
const sql = require('mssql');
const dbDefaultQuery = require('../db/dbDefaultQuery');
const { ERROR_MESSAGES } = require('../constants');
const { sendMail } = require('../objects/customMailer');
const { hashPassword } = require('../objects/passwordManager');

module.exports.userSignUp = (req, res) => {
    const name = req.body.name
    const email = req.body.email
    const nit = req.body.nit
    const numero = req.body.numero
    const password = req.body.password

    const SQLConsultaCheckEmailNotExist = SQLScripts.scriptVerifyMailNotRegistered;
    const SQLInsertNewUser = SQLScripts.scriptInsertNewUser;

    function callBackFunctionCreateUser(result) {
        if (result) {
            sendMail(process.env.ADMIN_EMAIL_ADDRESS,
                "Registro nuevo usuario",
                `Nuevo usuario registrado:  
nombre: ${name}
email: ${email} 
nit: ${nit}  `, () => {
                return res.json({ statusCode: 200, message: "success", dataInsertedId: result.recordset })
            }, () => {
                return res.status(500).json(ERROR_MESSAGES['error interno']);
            });

        } else {
            return res.status(500).json(ERROR_MESSAGES['error interno']);
        }
    }

    function createNewUser(hashedPassword) {
        const queryInputs = [
            {
                name: 'nit',
                type: sql.VarChar,
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
                value: hashedPassword
            }
        ]
        dbDefaultQuery.dbDefaultQuery(SQLInsertNewUser, queryInputs, callBackFunctionCreateUser, res);
    }

    function callBackFunctionAlreadyNotExistEmail(result) {

        if (result && result.recordset) {
            if (result.recordset.length > 0) {
                res.json({ statusCode: 400, message: "mail already exist" })
            } else {
                hashPassword(password, (err, hashedPassword) => {
                    if (err) {
                        return res.status(500).json(ERROR_MESSAGES['error interno']);
                    }
                    createNewUser(hashedPassword);

                });
                //createNewUser();
            }
        } else {
            return res.status(500).json(ERROR_MESSAGES['error interno']);
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

    if (stringValidator.validateMail(email) &&
        stringValidator.validateLength(password, 8, 80) &&
        stringValidator.validatePassword(password) &&
        stringValidator.validateLength(name, 1, 100) &&
        stringValidator.validateLength(nit, 4, 50)) {
        alreadyNotExistMail(email)
    }
    else {
        return res.status(400).json(ERROR_MESSAGES['Bad Request'])
    }
}