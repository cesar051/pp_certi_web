const loginValidator = {
    validateMail: (email) => {
        // Expresión regular para validar el formato del correo electrónico
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    },
    validatePassword: (passwordString) => {
        // Validar la contraseña
        const passwordRegex = /^[A-Za-z\d\W]{8,}$/;
        if (!passwordRegex.test(passwordString)) {
            return false;
        }
        return true
    },
    validateLength: (string, min, max) => {
        return string.length >= min && string.length <= max
    },
    validateSpecialChars: (string) => {
        const caracteresEspeciales = ".-_,;{}´¨+-*/!$%&#?¿'";
        for (let i = 0; i < caracteresEspeciales.length; i++) {
            if (string.includes(caracteresEspeciales[i])) {
                return true;
            }
        }
        return false; // Si ninguno de los caracteres especiales está presente
    },
    deleteLastSubstring: (cadena, subcadena) => {
        const indice = cadena.lastIndexOf(subcadena);
        if (indice === -1) {
            // La subcadena no está presente en la cadena
            return cadena;
        } else {
            // Elimina la última aparición de la subcadena
            return cadena.substring(0, indice) + cadena.substring(indice + subcadena.length);
        }
    },
    stringIsNumericOrNumber: (str) => {
        const num = Number(str);
        return (!isNaN(num) && num !== Infinity && num !== -Infinity) || typeof str === 'number';
    },
    isString: (value) => {
        return typeof value === 'string';
    },
    isNumericVariable: ({ value, maxDigits, maxDecimals }) => {
        // Convertir a string si es un número
        if (typeof value === 'number') {
            value = value.toString();
        }

        // Verificar si es una cadena numérica válida (con o sin punto decimal)
        if (typeof value !== 'string' || isNaN(value)) {
            return false;
        }

        // Remover posible signo negativo
        value = value.replace("-", "");

        // Separar la parte entera y la parte decimal
        const [integerPart, decimalPart = ""] = value.split(".");

        // Verificar longitud de la parte entera
        if (integerPart.length > maxDigits - maxDecimals) {
            return false;
        }

        // Verificar longitud de la parte decimal (si existe)
        if (decimalPart.length > maxDecimals) {
            return false;
        }

        // Si pasó todas las verificaciones, es válido
        return true;
    },
    isVarchar: (params) => {
        // Verificar si el valor es null
        if (params.value === null) {
            return true; // Válido si es null
        }

        // Convertir números a cadenas
        if (typeof params.value === 'number') {
            params.value = params.value.toString(); // Convertir a cadena
        } else if (typeof params.value !== 'string') {
            return false; // No es válido si no es una cadena ni un número
        }

        // Verificar que la longitud no exceda el máximo permitido
        return params.value.length <= params.maxLength;
    },
    isValidDate: (params) => {

        let date
        // Verificar si es una cadena
        if (typeof params.value !== 'string') {
            if (Number.isInteger(params.value)) {
                date = new Date(1899, 11, 30 + params.value)
            } else {
                return false; // No es válido si no es una cadena
            }
        } else { // si es un string
            const regex = /^(0?[1-9]|[12][0-9]|3[01])\/(0?[1-9]|1[0-2])\/\d{4}$/; // reconoce fechas en el formato dd/mm/yyyy
            if (regex.test(params.value)) {
                const [day, month, year] = params.value.split("/");
                params.value = `${year}-${month}-${day}`;
            }
            date = new Date(params.value);
        }

        // Verificar si la fecha es válida
        return !isNaN(date.getTime());
    }
};

module.exports = loginValidator;