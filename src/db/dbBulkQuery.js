const { sqli, getConnection } = require('./dbConnection')
const sql = require('mssql');

module.exports.dbBulkQuery = (TableName, columns, rowsToInsert, callBackFunction, res, extraCallBackParams) => {
    getConnection()  // Obtener la conexión
        .then(pool => {

            // Crear un objeto para el Bulk Insert
            const table = new sql.Table(TableName); // Nombre de la tabla en la BD

            columns.forEach((column) => {
                table.columns.add(column.name, column.type, column.nullable);
            })

            rowsToInsert.forEach(row => {
                table.rows.add(...row); // Aquí se propaga cada fila individualmente
            });

            const request = pool.request();
            return request.bulk(table);

        })
        .then(result => callBackFunction(result, extraCallBackParams))
        .catch(error => {
            console.log('Error al realizar la consulta:', error);
            res.status(500).send('Error al realizar la consulta.');
        });
}