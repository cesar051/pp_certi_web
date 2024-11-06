const SQLScripts = require('../db/SQLScripts')
const sql = require('mssql');
const { ERROR_MESSAGES } = require('../constants');
const { ExcelDataValidator } = require('../objects/excelDataValidator')
const { requiredColumnsUploadIVA } = require('../constants');
const dbBulkQuery = require('../db/dbBulkQuery');
const { dbExecuteProcedure } = require('../db/dbExecuteProcedure');

module.exports.uploadDataIVA = (req, res) => {
    //console.time('Tiempo de ejecución');
    const jsonData = req.body.jsonData

    // Función para obtener la fecha actual formateada para SQL Server
    function getCurrentDateForSQL() {
        return new Date().toISOString(); // Formato YYYY-MM-DDTHH:mm:ss.sssZ
    }

    const deleteSameValues = (jsonData) => {

        const table = new sql.Table(SQLScripts.typeNameTempTableDeleteWaMovFinanciero); // Nombre del tipo de tabla

        table.columns.add('nit', sql.VarChar(60), { nullable: false });
        table.columns.add('concepto', sql.VarChar(20), { nullable: false });
        table.columns.add('year', sql.Int, { nullable: false });
        table.columns.add('periodo', sql.Int, { nullable: false });

        jsonData.forEach(item => {
            table.rows.add(
                String(item.nit),
                String(item.concepto),
                Number(item.year),
                Number(item.periodo)
            )
        })

        const queryInputs = [
            {
                name: 'tvp',
                value: table
            },
        ]

        function callBackFunctionDeleteValues(response) {
            if (response && response.recordsets) {
                uploadDataToBD(jsonData)
            } else {
                return res.status(500).json(ERROR_MESSAGES['error interno']);
            }
        }

        dbExecuteProcedure(SQLScripts.procedureNameDeleteWaMovFinanciero,
            queryInputs,
            callBackFunctionDeleteValues,
            res)
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
                name: 'iva', type: sql.Numeric(14, 2), nullable: { nullable: true }
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
            item.iva,
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
            return res.json({ statusCode: 200, message: "success" })
        }

        dbBulkQuery.dbBulkQuery(SQLScripts.tableNameToUploadMovFinanciero, columns, rowsToInsert, callBackFunction, res)

    }

    if (ExcelDataValidator(jsonData, requiredColumnsUploadIVA)) {
        deleteSameValues(jsonData)
    } else {
        //not valid entries
        return res.status(400).json(ERROR_MESSAGES['Bad Request'])
    }

}