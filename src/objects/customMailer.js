const nodemailer = require('nodemailer');

function sendMail(recipientAddress, subject, body, successCallBack, errorCallBack) {
    let transporter = nodemailer.createTransport({
        host: process.env.MAILER_HOST,
        //service: 'smtp.gmail.com', // Proveedor de correo
        port: process.env.MAILER_PORT,
        //secure: true,
        //logger: true,
        //debug: true,
        //secureConnection: false,
        auth: {
            user: process.env.MAILER_EMAIL_ADDRESS, // Tu dirección de correo electrónico
            pass: process.env.MAILER_PASSWORD // Tu contraseña de correo electrónico
        },

    });

    transporter.verify((err, success) => {
        if (err) console.error(err);
        console.log('Your config is correct');
    });

    //console.log(transporter.options.host);

    // Configuración del correo electrónico
    let mailOptions = {
        from: `"Admin" <${process.env.MAILER_EMAIL_ADDRESS}>`, // Tu dirección de correo electrónico
        to: recipientAddress, // Correo electrónico del destinatario
        subject: subject,
        text: body
    };

    // Enviar el correo electrónico
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log('Error al enviar el correo electrónico:', error);
            if (errorCallBack) {
                errorCallBack()
            }
        } else {
            console.log('Correo electrónico enviado:', info.response);
            if (successCallBack) {
                successCallBack()
            }
        }
    });

}

module.exports = {
    sendMail
}