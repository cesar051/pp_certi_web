const SQLScripts = require('../db/SQLScripts')
const sql = require('mssql');
const dbDefaultQuery = require('../db/dbDefaultQuery');
const { ERROR_MESSAGES } = require('../constants');

module.exports.getCertificateInfo = (req, res) => {

    const userId = req.user.userId
    const nit = req.body.nit
    const periodo = req.body.periodo
    const year = req.body.year
    const concepto = req.body.concepto

    console.log("entrando basic info " + userId)
    const SQLscriptGetUserBasicInfo = `SELECT TOP(1) m.descripcion, m.porcentaje, m.base, m.retenido, m.ciudad_pago, m.ciudad_expedido, m.indicador_impuesto, m.fecha_expedicion
FROM wa_mov_financiero m JOIN wa_usuarios u ON m.nit = u.nit 
WHERE m.nit=@nit and m.periodo=@periodo and m.year = @year and m.concepto =@concepto and u.id=@userId;`//SQLScripts.scriptGetUserBasicInfo;

    const queryInputs = [
        {
            name: 'nit',
            type: sql.VarChar,
            value: nit
        },
        {
            name: 'periodo',
            type: sql.Int,
            value: periodo
        },
        {
            name: 'year',
            type: sql.Int,
            value: year
        },
        {
            name: 'concepto',
            type: sql.Int,
            value: concepto
        },
        {
            name: 'userId',
            type: sql.Int,
            value: userId
        },
    ]

    function callBackFunctionGetCertificateInfo(response) {
        if (response && response.recordsets) {
            console.log(response);
            res.json({ statusCode: 200, message: "success", data: response.recordsets })
        } else {
            return res.status(500).json(ERROR_MESSAGES['error interno']);
        }
    }

    dbDefaultQuery.dbDefaultQuery(SQLscriptGetUserBasicInfo, queryInputs, callBackFunctionGetCertificateInfo, res);

}