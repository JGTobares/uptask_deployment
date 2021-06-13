const express = require('express');
const router = express.Router();

//importar express validator
const { body } = require('express-validator');

//importamos controlador
const proyectController = require('../controllers/proyectoControllers');
const tareaController = require('../controllers/tareaControllers');
const usuarioController = require('../controllers/usuarioControllers');
const authController = require('../controllers/authControllers');

module.exports = function() {
    //ruta para el home
    router.get('/', authController.usuarioAutenticado , proyectController.proyectosHome );
    router.get('/nuevo-proyecto', authController.usuarioAutenticado, proyectController.formularioProyecto);
    router.post('/nuevo-proyecto', authController.usuarioAutenticado,
    body('nombre').not().isEmpty().trim().escape(),
    proyectController.nuevoProyecto
    );
    
    //Listar proyectos
    router.get('/proyectos/:url', authController.usuarioAutenticado, proyectController.proyectoPorUrl);

    //Actualizar el proyecto
    router.get('/proyecto/editar/:id', authController.usuarioAutenticado, 
    proyectController.formularioEditar
    );
    router.post('/nuevo-proyecto/:id',
    body('nombre').not().isEmpty().trim().escape(),
    proyectController.actualizarProyecto
    );

    //Eliminar proyectos
    router.delete('/proyectos/:url', authController.usuarioAutenticado, proyectController.eliminarProyecto);

    //Tareas
    router.post('/proyectos/:url', authController.usuarioAutenticado, tareaController.agregarTarea)

    //Actualizar tarea
    router.patch('/tareas/:id', authController.usuarioAutenticado, tareaController.cambiarEstadoTarea);

    //Eliminar tarea
    router.delete('/tareas/:id', authController.usuarioAutenticado, tareaController.eliminarTarea);

    //Crear nueva cuenta
    router.get('/crear-cuenta', usuarioController.formCrearCuenta);
    router.post('/crear-cuenta', usuarioController.crearCuenta);
    router.get('/confirmar/:correo', usuarioController.confirmarCuenta);
 
    //iniciar sesion
    router.get('/iniciar-sesion', usuarioController.formIniciarSesion);
    router.post('/iniciar-sesion', authController.autenticarUsuario);

    //cerrar sesion
    router.get('/cerrar-sesion', authController.cerrarSesion);

    //Restablecer password
    router.get('/restablecer', usuarioController.formResetPassword);
    router.post('/restablecer', authController.enviarToken);
    router.get('/restablecer/:token', authController.validarToken);
    router.post('/restablecer/:token', authController.actualizarPassword);

    return router;
}