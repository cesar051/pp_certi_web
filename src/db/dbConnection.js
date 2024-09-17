const mssql = require('mssql');

const options = {
    user: process.env.DB_USER_NAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE_NAME,
    server: process.env.DB_HOST,
    port: Number(process.env.DB_PORT)
}

function getConnection() {
    return mssql.connect(options)
        .then(pool => {
            //console.log('Conexión a MSSQL exitosa');
            return pool;  // Devuelve el objeto de conexión (pool)
        })
        .catch(err => {
            console.error('Error al conectar a MSSQL:', err);
            throw err;  // Lanza el error para manejarlo fuera
        });
}

// Exportar el módulo para ser utilizado en otros archivos
module.exports = {
    mssql,
    getConnection
};