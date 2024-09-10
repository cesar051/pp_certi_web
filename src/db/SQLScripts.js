module.exports = {
    scriptVerifyUserPassword: "SELECT id FROM wa_usuarios WHERE correo = @correo and clave = @clave"
}