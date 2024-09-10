const { sqli, getConnection } = require('../db/dbConnection')
const jwt = require('jsonwebtoken')
const SQLScripts = require('../db/SQLScripts')
const stringValidator = require('../objects/stringValidator')
const sql = require('mssql');
module.exports.userLogin = (req, res) => {

    const email = req.query.userEmail
    const pass = req.query.userPassword
    console.log(email, pass);
    const consulta = SQLScripts.scriptVerifyUserPassword

    function validateParams(email, pass) {
        if (stringValidator.validateMail(email) && stringValidator.validateLength(pass, 1, 80) && stringValidator.validateSpecialChars(pass)) {
            getUserId()
        }
        else {
            res.json({ statusCode: 400, message: "wrong user/password" })
        }
    }

    function getUserId() {
        getConnection()  // Obtener la conexión
            .then(pool => {
                // Realizar la consulta SQL
                const request = pool.request();
                request.input('correo', sql.VarChar, email)
                request.input('clave', sql.VarChar, pass)
                return request.query(consulta);
            })
            .then(result => {
                console.log(result.recordset);

                if (result && result.recordset && result.recordset.length > 0) {
                    JWTSignUser(result.recordset[0].id)

                } else {
                    res.json({ statusCode: 400, message: "wrong user/password" })
                }
                //res.json(result.recordset);  // Enviar los datos como respuesta JSON
            })
            .catch(error => {
                console.error('Error al realizar la consulta:', error);
                res.status(500).send('Error al realizar la consulta.');
            });
    }

    function JWTSignUser(userId) {

        const token = jwt.sign({ userId: userId }, "miclavesecrete", {
            expiresIn: '2d'
        });

        res.json({ statusCode: 200, message: "accede", token: token })
    }

    getUserId()
}