module.exports = {
    scriptVerifyUserPassword: "SELECT id, nit, nombres, correo, celular, perfil, clave FROM wa_usuarios WHERE correo = @correo and estado = 'A'",
    scriptVerifyMailNotRegistered: "SELECT id FROM wa_usuarios WHERE correo = @correo",
    scriptInsertNewUser: "INSERT INTO wa_usuarios (nit, nombres, correo, celular, fecha_creacion, estado, perfil, clave) OUTPUT INSERTED.id VALUES (@nit, @nombre, @correo, @celular, GETDATE(), 'I', '0', @clave);",
    scriptGetUserBasicInfo: "select id, nit, nombres, correo, celular, perfil from wa_usuarios where id = @userId ;",
    scriptGetToken: "select id from wa_refresh_tokens where token = @token",
    scriptDeleteRefreshToken: "delete from wa_refresh_tokens where token = @token",
    scriptInsertRefreshToken: "INSERT INTO wa_refresh_tokens (token) OUTPUT INSERTED.id VALUES (@token);",
    scriptDeleteOTPById: "DELETE FROM wa_otp_tokens WHERE otp_id = @otp_id",
    scriptUpdateUserPassword: "UPDATE wa_usuarios SET clave = @clave WHERE id = @userId and correo = @correo;",
    scriptGetOTPInfo: "SELECT TOP 1 t.otp_id, t.user_id, u.correo, t.otp_hash, t.expires_at, t.number_tries FROM wa_otp_tokens t JOIN wa_usuarios u on t.user_id = u.id WHERE u.correo = @correo ;",
    scriptIncreaseOTPTries: "UPDATE wa_otp_tokens SET number_tries = number_tries + 1 WHERE otp_id = @otp_id; ",
    scriptInsertOTP: `
                IF EXISTS (SELECT 1 FROM wa_otp_tokens WHERE user_id = @userId)
        BEGIN
            -- Si existe, actualiza el registro
            UPDATE wa_otp_tokens
            SET otp_hash = @otpHash,
                expires_at = @expiresAt,
                number_tries = 0
            WHERE user_id = @userId;
        END
        ELSE
        BEGIN
            -- Si no existe, inserta un nuevo registro
            INSERT INTO wa_otp_tokens (user_id, otp_hash, expires_at, number_tries)
            VALUES (@userId, @otpHash, @expiresAt, 0);
        END`,
    scriptGetIdRelatedToEmail: "SELECT id FROM wa_usuarios where correo = @correo;",
    scriptGetUsersWithPagination: `
            SELECT id, nit, nombres, correo, celular, estado 
            FROM wa_usuarios 
            ORDER BY id 
            OFFSET @initial_offset ROWS 
            FETCH NEXT @quantity_per_page ROWS ONLY;
        `,
    scriptGetTotalNumberOfUsers: "SELECT COUNT(*) AS cantidad_usuarios FROM wa_usuarios;",
    scriptUpdateUserState: "UPDATE wa_usuarios SET estado = @newUserState WHERE id = @userIdToUpdate;",
    scriptGetUsersWithPaginationFiltered: `
            SELECT id, nit, nombres, correo, celular, estado
            FROM wa_usuarios
            WHERE estado = @user_state
            ORDER BY id 
            OFFSET @initial_offset ROWS 
            FETCH NEXT @quantity_per_page ROWS ONLY ;
        `,
    scriptGetTotalNumberOfUsersFiltered: "SELECT COUNT(*) AS cantidad_usuarios FROM wa_usuarios WHERE estado = @user_state;",
    scriptGetPerfilOfUser: `SELECT perfil FROM wa_usuarios WHERE id= @userId`
}