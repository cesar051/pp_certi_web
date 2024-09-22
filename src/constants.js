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

module.exports = {
    USER_STATES,
    SUCCESS_MESSAGES,
    ERROR_MESSAGES
};