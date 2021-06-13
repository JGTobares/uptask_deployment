const passport = require('passport');
const Usuarios = require('../models/Usuarios');
const crypto = require('crypto');
const Sequelize  = require('sequelize');
const Op = Sequelize.Op;
const bcrypt = require('bcrypt-nodejs');
const enviarEmail = require('../handlers/email');

exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect:  '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos campos son obligatorios'
});

//Funcion para verificar si el usuario se encuentra logeado o no
exports.usuarioAutenticado = (req,res,next) => {

    // si el user esta auth, go on
    if(req.isAuthenticated()) {
        return next();
    }
    //si no esta loged, go to sign in
    return res.redirect('/iniciar-sesion');
}

//Funcion para cerrar sesionn
exports.cerrarSesion = (req,res,next) => {
    req.session.destroy(() => {
        res.redirect('/iniciar-sesion'); // al cerrar sesion va al login
    });
}

//Genera un token si el usuario es valido
exports.enviarToken = async (req,res) => {
    //verificar que el user existe
    const usuario = await Usuarios.findOne({where: {email: req.body.email}});

    //Si no hay usuario
    if(!usuario) {
        req.flash('error', 'No existe esa cuenta');
        res.redirect('/restablecer');
    }

    //usuario existe
    //generar token
    usuario.token = crypto.randomBytes(20).toString('hex');
    usuario.expiracion = Date.now() + 3600000;

    //guardar en DB
    await usuario.save();

    //url de reset
    const resetUrl = `http://${req.headers.host}/restablecer/${usuario.token}`;

    //Envia el correo con el token
    await enviarEmail.enviar({
        usuario,
        subject: 'Password Reset',
        resetUrl,
        archivo: 'reset-password'
    });

    req.flash('correcto', 'Se envio un mensaje a tu correo');
    res.redirect('/iniciar-sesion');
}

exports.validarToken = async (req,res) => {
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token
        }
    });

    //Si no encuentra el usuario
    if(!usuario) {
        req.flash('error', 'No valido');
        res.redirect('/restablecer');
    }

    //formulario para reset password
    res.render('resetPassword', {
        nombrePagina : 'Restablece Password'
    });
}

//Actualizar password
exports.actualizarPassword = async (req,res) => {
    
    //Verifica token valido y fecha de exp
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token,
            expiracion: {
                [Op.gte] : Date.now()
            }
        }
    });

    //verificamos si el user existe
    if(!usuario) {
        res.flash('error', 'No valido');
        res.redirect('/restablecer');
    }

    //hash el nuevo password
    usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    usuario.token = null;
    usuario.expiracion = null;

    //guardamos el nuevo password
    await usuario.save();

    req.flash('correcto', 'El password ha sido modificado correctamente');
    res.redirect('/iniciar-sesion');
}