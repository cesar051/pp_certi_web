const SQLScripts = require('../db/SQLScripts')
const sql = require('mssql');
const dbDefaultQuery = require('../db/dbDefaultQuery');
const { ERROR_MESSAGES } = require('../constants');
const { sqli, getConnection } = require('../db/dbConnection')
const { ExcelDataValidator } = require('../objects/excelDataValidator')
const { requiredColumnsUploadIVA } = require('../constants');
const dbBulkQuery = require('../db/dbBulkQuery');

module.exports.uploadDataIVA = (req, res) => {
    console.time('Tiempo de ejecución');
    const jsonData = req.body.jsonData

    // Función para obtener la fecha actual formateada para SQL Server
    function getCurrentDateForSQL() {
        return new Date().toISOString(); // Formato YYYY-MM-DDTHH:mm:ss.sssZ
    }

    const uploadDataToBD = (jsonData) => {
        const columns = [
            {
                name: 'id_empresa', type: sql.Numeric(20), nullable: { nullable: false }
            },
            {
                name: 'nit', type: sql.VarChar, nullable: { nullable: false }
            },
            {
                name: 'cuenta', type: sql.VarChar, nullable: { nullable: true }
            },
            {
                name: 'descripcion', type: sql.VarChar, nullable: { nullable: true }
            },
            {
                name: 'concepto', type: sql.VarChar, nullable: { nullable: true }
            },
            {
                name: 'porcentaje', type: sql.Numeric(3), nullable: { nullable: false }
            },
            {
                name: 'base', type: sql.Numeric(14, 2), nullable: { nullable: false }
            },
            {
                name: 'retenido', type: sql.Numeric(14, 2), nullable: { nullable: false }
            },
            {
                name: 'year', type: sql.Numeric(4), nullable: { nullable: false }
            },
            {
                name: 'periodo', type: sql.Numeric(2), nullable: { nullable: false }
            },
            {
                name: 'ciudad_pago', type: sql.VarChar, nullable: { nullable: true }
            },
            {
                name: 'ciudad_expedido', type: sql.VarChar, nullable: { nullable: true }
            },
            {
                name: 'banco_pago', type: sql.Numeric(6), nullable: { nullable: true }
            },
            {
                name: 'indicador_impuesto', type: sql.Numeric(6), nullable: { nullable: true }
            },
            {
                name: 'fecha_expedicion', type: sql.Date, nullable: { nullable: true }
            },
            {
                name: 'fecha_creacion', type: sql.DateTime, nullable: { nullable: true }
            }
        ]

        const currentDate = getCurrentDateForSQL()
        const rowsToInsert = jsonData.map(item => [
            item.id_empresa,
            String(item.nit),
            String(item.cuenta),
            item.descripcion,
            item.concepto,
            item.porcentaje,
            item.base,
            item.retenido,
            item.year,
            item.periodo,
            item.ciudad_pago,
            item.ciudad_expedido,
            item.banco_pago,
            item.indicador_impuesto,
            item.fecha_expedicion,
            currentDate // Pasar la fecha actual como `fecha_creacion`
        ])

        function callBackFunction(result, extraCallBackParams) {
            console.log(result);
            console.timeEnd('Tiempo de ejecución');
            return res.json({ statusCode: 200, message: "success" })
        }

        dbBulkQuery.dbBulkQuery('wa_mov_financiero', columns, rowsToInsert, callBackFunction, res)

    }

    if (ExcelDataValidator(jsonData, requiredColumnsUploadIVA)) {
        console.log("datos validos");
        uploadDataToBD(jsonData)
    } else {
        console.log(" no valido");
        return res.status(400).json(ERROR_MESSAGES['Bad Request'])
    }

}