const Usuarios = require('../models/Usuarios');
const enviarEmail = require('../handlers/email');

exports.formCrearCuenta = (req,res) => {
    res.render('crearCuenta', {
        nombrePagina: 'Crear Cuenta en UpTask'
    });
}

exports.formIniciarSesion = (req,res) => {
    const { error } = res.locals.mensajes;
    res.render('iniciarSesion', {
        nombrePagina: 'Iniciar Sesion en UpTask',
        error
    });
}

exports.crearCuenta = async (req,res) => {
    // Leer los datos
    const { email, password } = req.body;

    try {
        //Crear el usuario
        await Usuarios.create({
            email,
            password
        });
        //Crear una URL de confirmacion
        const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`;
        //Crear el objeto de usuario 
        const usuario = {
            email
        }
        //Enviar Email
        await enviarEmail.enviar({
            usuario,
            subject: 'Confirma tu cuenta UpTask',
            confirmarUrl,
            archivo: 'confirmar-cuenta'
        });

        //Redirigir al usuario
        res.redirect('/iniciar-sesion')
    } catch(e) {
        req.flash('error', e.errors.map(error => e.message));
        res.render('crearCuenta', {
            mensajes: req.flash() ,
            nombrePagina: 'Crear Cuenta en UpTask',
            email,
            password
        })
    }
}
exports.formResetPassword = (req,res) => {
    res.render('restablecer', {
        nombrePagina: 'Restablecer tu password'
    });
}

//Cambia el estado de una cuenta
exports.confirmarCuenta = async (req,res) => {
    const usuario = await Usuarios.findOne({
        where: {
            email: req.params.correo
        }
    });

    if(!usuario) {
        req.flash('error', 'No Valido');
        res.redirect('/crear-cuenta');
    }

    usuario.activo = 1;
    await usuario.save();

    req.flash('correcto', 'Cuenta activada correctamente');
    res.redirect('/iniciar-sesion');
}
 