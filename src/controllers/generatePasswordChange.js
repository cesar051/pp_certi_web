const SQLScripts = require('../db/SQLScripts')
const sql = require('mssql');
const dbDefaultQuery = require('../db/dbDefaultQuery')
const nodemailer = require('nodemailer');
const { generateOTP, hashOTP, createOTPExpirationDate } = require('../objects/OTPManager');
const { ERROR_MESSAGES } = require('../constants');

module.exports.generatePasswordChange = (req, res) => {

    const email = req.body.email

    function sendMailWithOTP(intOTP) {
        let transporter = nodemailer.createTransport({
            host: process.env.MAILER_HOST,
            //service: 'smtp.gmail.com', // Proveedor de correo
            port: process.env.MAILER_PORT,
            //secure: true,
            //logger: true,
            //debug: true,
            //secureConnection: false,
            auth: {
                user: process.env.MAILER_EMAIL_ADDRESS, // Tu dirección de correo electrónico
                pass: process.env.MAILER_PASSWORD // Tu contraseña de correo electrónico
            },

        });

        transporter.verify((err, success) => {
            if (err) console.error(err);

        });

        //console.log(transporter.options.host);

        // Configuración del correo electrónico
        let mailOptions = {
            from: `"Olvido de contraseña" <${process.env.MAILER_EMAIL_ADDRESS}>`, // Tu dirección de correo electrónico
            to: email, // Correo electrónico del destinatario
            subject: 'Link de reestablecimiento de contraseña',
            text: `Su codigo de restablecimiento es ${intOTP} `
        };

        // Enviar el correo electrónico
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log('Error al enviar el correo electrónico:', error);
                return res.status(400).json(ERROR_MESSAGES['error interno'])
            } else {
                console.log('Correo electrónico enviado:', info.response);
                res.json({ statusCode: 200, message: "success" })
            }
        });
    }

    function uploadOTP(userId) {
        const intOTP = generateOTP()
        const hashedOTP = hashOTP(intOTP)//crypto.createHash('sha256').update(intOTP).digest('hex');
        const expiresAt = createOTPExpirationDate()// Expira en 10 minutos
        console.log(hashedOTP, expiresAt);

        const SQLscriptInsertOPT = SQLScripts.scriptInsertOTP
        //SQLScripts.scriptGetUserBasicInfo;//SQLScripts.scriptVerifyUserPassword
        const queryInputs = [
            {
                name: 'userId',
                type: sql.Int,
                value: userId
            },
            {
                name: 'otpHash',
                type: sql.VarChar,
                value: hashedOTP
            },
            {
                name: 'expiresAt',
                type: sql.DateTime,
                value: expiresAt
            }
        ]

        function callBackFunctionInsertOPT(response) {

            if (response) {
                sendMailWithOTP(intOTP)
            } else {
                return res.status(500).json(ERROR_MESSAGES['error interno']);
            }
        }

        dbDefaultQuery.dbDefaultQuery(SQLscriptInsertOPT, queryInputs, callBackFunctionInsertOPT, res);

    }

    function getEmailId() {

        const SQLscriptGetIdRElatedToEmail = SQLScripts.scriptGetIdRelatedToEmail //SQLScripts.scriptGetUserBasicInfo;//SQLScripts.scriptVerifyUserPassword
        const queryInputs = [
            {
                name: 'correo',
                type: sql.VarChar,
                value: email
            },
        ]

        function callBackFunctionGetUsers(response) {
            if (response && response.recordset) {

                if (response.recordset.length === 1) {

                    uploadOTP(response.recordset[0].id)

                } else {
                    res.json({ statusCode: 200, message: "success" })
                }
            } else {
                return res.status(500).json(ERROR_MESSAGES['error interno']);
            }
        }

        dbDefaultQuery.dbDefaultQuery(SQLscriptGetIdRElatedToEmail, queryInputs, callBackFunctionGetUsers, res);
    }
    getEmailId()
}