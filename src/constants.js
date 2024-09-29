const USER_STATES = {
    "A": {
        "label": "Activo",
        "BD_KEY": "A"
    },
    "I": {
        "label": "Inactivo",
        "BD_KEY": "I"
    }
}

const SUCCESS_MESSAGES = {

}

const ERROR_MESSAGES = {
    'unauthorized': {
        statusCode: 401,
        msg: 'unauthorized'
    },
    'no token provided': {
        statusCode: 401,
        msg: 'no token provided'
    },
    'invalid code': {
        statusCode: 400,
        msg: 'invalid code'
    },
    'error interno': {
        statusCode: 500,
        msg: 'error interno'
    },
    'Bad Request': {
        statusCode: 400,
        msg: 'Bad Request'
    },
    'wrong user/password': {
        statusCode: 400,
        msg: 'wrong user/password'
    }
}

const requiredColumnsUploadIVA = {
    "id_empresa": {
        null: false,
        type: "NUMERIC",
        length: [20, 0]
    },
    "nit": {
        null: false,
        type: "VARCHAR",
        length: 60
    },
    "cuenta": {
        null: true,
        type: "VARCHAR",
        length: 60
    },
    "descripcion": {
        null: true,
        type: "VARCHAR",
        length: 300
    },
    "concepto": {
        null: true,
        type: "VARCHAR",
        length: 20
    },
    "porcentaje": {
        null: false,
        type: "NUMERIC",
        length: [5, 2]
    },
    "base": {
        null: false,
        type: "NUMERIC",
        length: [14, 2]
    },
    "retenido": {
        null: false,
        type: "NUMERIC",
        length: [14, 2]
    },
    "year": {
        null: false,
        type: "NUMERIC",
        length: [4, 0]
    },
    "periodo": {
        null: false,
        type: "NUMERIC",
        length: [2, 0]
    },
    "ciudad_pago": {
        null: true,
        type: "VARCHAR",
        length: 30
    },
    "ciudad_expedido": {
        null: true,
        type: "VARCHAR",
        length: 30
    },
    "banco_pago": {
        null: true,
        type: "NUMERIC",
        length: [6, 0]
    },
    "indicador_impuesto": {
        null: true,
        type: "NUMERIC",
        length: [6, 0]
    },
    "fecha_expedicion": {
        null: true,
        type: "DATE",
        length: 0
    }
};

module.exports = {
    USER_STATES,
    SUCCESS_MESSAGES,
    ERROR_MESSAGES,
    requiredColumnsUploadIVA
};