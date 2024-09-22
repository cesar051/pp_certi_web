const loginValidator = {
    validateMail: (email) => {
        // Expresión regular para validar el formato del correo electrónico
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
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
    }
};

module.exports = loginValidator;