const { sqli, getConnection } = require('./dbConnection')

module.exports.dbExecuteProcedure = (SQLProcedureName, requestInputs, callBackFunction, res, extraCallBackParams) => {
    getConnection()  // Obtener la conexión
        .then(pool => {
            // Realizar la consulta SQL
            const request = pool.request();
            requestInputs.forEach(requestInput => {
                request.input(requestInput.name, requestInput.value);
            });
            return request.execute(SQLProcedureName);

        })
        .then(result => callBackFunction(result, extraCallBackParams))
        .catch(error => {
            console.log('Error al realizar la consulta:', error);
            res.status(500).send('Error al realizar la consulta.');
        });
}