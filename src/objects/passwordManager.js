const argon2 = require('argon2');

/**
 * Hashea una contraseña usando Argon2 con configuraciones personalizadas.
 * @param {string} password - La contraseña a hashear.
 * @param {function} callback - Función de callback que recibe el resultado.
 */

const hashPassword = (password, callback) => {
    const options = {
        timeCost: 4,          // Más iteraciones aumentan el tiempo de procesamiento
        memoryCost: 2 ** 16,  // 64 MB de memoria
        parallelism: 2,       // Ejecutar con 2 hilos paralelos
        type: argon2.argon2id // Usa Argon2id para mayor seguridad
    };

    argon2.hash(password, options)
        .then(hashedPassword => {
            callback(null, hashedPassword); // Devuelve el hash a través del callback
        })
        .catch(err => {
            callback(err); // Maneja el error en el callback
        });
};

const comparePassword = (password, hashedPassword, callback) => {
    argon2.verify(hashedPassword, password)
        .then(isMatch => {
            callback(null, isMatch); // Devuelve el resultado de la comparación
        })
        .catch(err => {
            callback(err); // Maneja el error en el callback
        });
};

module.exports = {
    hashPassword,
    comparePassword
}