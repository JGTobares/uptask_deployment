const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');

exports.proyectosHome = async (req,res) =>{
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where: {usuarioId: usuarioId}});
    
    res.render('index', {
        nombrePagina : 'Proyectos',
        proyectos
    });
} 

exports.formularioProyecto = async (req,res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where: {usuarioId: usuarioId}});
    res.render('nuevoProyecto', {
        nombrePagina : 'Nuevo Proyecto',
        proyectos
    });
}

exports.nuevoProyecto = async (req,res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where: {usuarioId: usuarioId}});

    const {nombre} = req.body;

    let errores = [];
    // A futuro implementar express validator

    if (!nombre) {
        errores.push({'texto' : 'Agregar un Nombre al Proyecto'});
    }

    // si hay errores
    if (errores.length > 0){ 
        res.render('nuevoProyecto', {
            nombrePagina : 'Nuevo Proyecto',
            errores,
            proyectos
        })
    } else {
        //No hay errores, se inserta datos en la DB
        //Se emplean hooks para manejar las url
        const usuarioId = res.locals.usuario.id;
        await Proyectos.create({ nombre, usuarioId });
        res.redirect('/');
    }
}

exports.proyectoPorUrl = async (req,res, next) => {
    const usuarioId = res.locals.usuario.id;
    const proyectosPromise = Proyectos.findAll({where: {usuarioId: usuarioId}});
    const proyectoPromise = Proyectos.findOne({
        where: {
            url: req.params.url,
            usuarioId
        }
    });

    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);
 
    //consultar tareas de proyecto actual
    const tareas = await Tareas.findAll({
        where: {
            proyectoId: proyecto.id
        }
        /*
        ,
        include: [
            {model: Proyectos}
        ]
        */
    });

    if (!proyecto) return next();

    //Render a la vista, se crea nueva vista Tareas
    res.render('tareas', {
        nombrePagina: 'Tareas del Proyecto',
        proyecto,
        proyectos,
        tareas
    })
}

exports.formularioEditar = async (req,res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectosPromise = Proyectos.findAll({where: {usuarioId: usuarioId}});
    const proyectoPromise = Proyectos.findOne({
        where: {
            id: req.params.id,
            usuarioId
        }
    });

    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);

    //render a la vista
    res.render('nuevoProyecto', {
        nombrePagina: 'Editar Proyecto',
        proyectos,
        proyecto
    });
}

exports.actualizarProyecto = async (req,res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where: {usuarioId: usuarioId}});
    
    const {nombre} = req.body;

    let errores = [];
    // A futuro implementar express validator

    if (!nombre) {
        errores.push({'texto' : 'Agregar un Nombre al Proyecto'});
    }

    // si hay errores
    if (errores.length > 0){ 
        res.render('nuevoProyecto', {
            nombrePagina : 'Nuevo Proyecto',
            errores,
            proyectos
        })
    } else {
        //No hay errores, se inserta datos en la DB
        //Se emplean hooks para manejar las url
        await Proyectos.update(
            { nombre: nombre },
            { where: { id: req.params.id}}
        );
        res.redirect('/');
    }
}

exports.eliminarProyecto = async (req,res,next) => {
    //req query o params
    const {urlProyecto} = req.query;

    const resultado = await Proyectos.destroy({where: { url: urlProyecto}});

    if(!resultado) {
        return next();
    }

    res.status(200).send('Proyecto Eliminado Correctamente');
}