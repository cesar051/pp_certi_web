const stringValidator = require('./stringValidator')

function ExcelDataValidator(jsonData, requiredColumns) {

    const rowValidator = {
        "VARCHAR": (value, length, canBeNull) => {
            if (value === null) {
                return canBeNull; // Válido si es null
            }
            return stringValidator.isVarchar({ value: value, maxLength: length })
        },
        "NUMERIC": (value, length, canBeNull) => {
            if (value === null) {
                return canBeNull; // Válido si es null
            }
            return stringValidator.isNumericVariable({ value: value, maxDigits: length[0], maxDecimals: length[1] })
        },
        "DATE": (value, length, canBeNull) => {
            if (value === null) {
                return canBeNull; // Válido si es null
            }
            return stringValidator.isValidDate({ value: value })
        }
    }

    // Verificar que todas las columnas necesarias estén presentes
    const columns = Object.keys(jsonData[0]);
    const missingColumns = Object.keys(requiredColumns).filter(col => !columns.includes(col));

    if (missingColumns.length > 0) {

        return false;
    }

    // Validar el formato de los datos en cada fila
    for (let row of jsonData) {
        for (let [key, type] of Object.entries(requiredColumns)) {
            const value = row[key];

            if (!rowValidator[type.type](value, type.length, type.canBeNull)) {
                console.log(key, type);

                console.log(row);

                return false;
            }
        }
    }

    return true;
}

module.exports = {
    ExcelDataValidator
}