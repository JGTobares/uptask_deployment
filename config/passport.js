const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

//Referencia al Modelo que vamos a autenticar
const Usuarios = require('../models/Usuarios');

//local strategy - Login con credenciales propias (usuario y password)
passport.use(
    new LocalStrategy(
        //por default passport espera un user y pass
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done) => {
            try {
                const usuario = await Usuarios.findOne({
                    where: { 
                        email,
                        activo: 1
                    }
                });
                //El usuario existe, password incorrecto
                if(!usuario.verificarPassword(password)){
                    return done(null, false, {
                        message: 'Password Incorrecto' 
                    }) 
                }
                //El Email existe, password correcto
                return done(null, usuario);
            } catch (e) {
                //Ese usuario no existe
                return done(null, false, {
                    message: 'Esa cuenta no existe' 
                })
            }
        }
    )
);

//Serializar usuario
passport.serializeUser((usuario, callback) => {
    callback(null, usuario);
});

//Descerealizar usuario
passport.deserializeUser((usuario, callback) => {
    callback(null, usuario);
});

module.exports = passport;