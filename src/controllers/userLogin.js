const { sql, getConnection } = require('../db/dbConnection')
/*const jwt = require('jsonwebtoken')
const SQLScripts = require('../db/SQLScripts')
const stringValidator = require('../objects/stringValidator')*/

module.exports.userLogin = (req, res) => {

    getConnection()  // Obtener la conexión
        .then(pool => {
            // Realizar la consulta SQL
            return pool.request().query('SELECT * FROM wa_usuarios');
        })
        .then(result => {
            res.json(result.recordset);  // Enviar los datos como respuesta JSON
        })
        .catch(error => {
            console.error('Error al realizar la consulta:', error);
            res.status(500).send('Error al realizar la consulta.');
        });

    //res.json({ statusCode: 400, message: "tamo activo papi" })

    /*const email = req.query.userEmail
    const pass = req.query.userPassword

    const consulta = SQLScripts.scriptVerifyUserPassword

    if (stringValidator.validateMail(email) && stringValidator.validateLength(pass, 1, 80) && stringValidator.validateSpecialChars(pass)) {
        try {
            dbConnection.query(consulta, [email, pass], (err, results) => {
                if (err) {
                    console.log(err)
                    res.send({ statusCode: 400, message: "wrong user/password" })
                } else {
                    if (results && results.length > 0) {
                        
                        userId = results[0].userId
                        
                        const token = jwt.sign({ userId: userId }, "miclavesecrete", {
                            expiresIn: '2d'
                        });

                        res.json({ statusCode: 200, message: "accede", token: token })
                    } else {
                        res.json({ statusCode: 400, message: "wrong user/password" })
                    }
                }


            })
        } catch (e) {
            console.log("error")
            res.json({ statusCode: 400, message: "wrong user/password" })
        }
    }
    else {
        res.json({ statusCode: 400, message: "wrong user/password" })
    }*/
}