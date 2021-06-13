const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');

exports.agregarTarea = async (req,res,next) => {
    //Obtenemos proyecto actual
    const proyecto = await Proyectos.findOne({where:{url: req.params.url}});
    console.log(proyecto);

    //leer valor de input
    const {tarea} = req.body;
    const estado = 0;
    const proyectoId = proyecto.id;

    //Insertar en DB 
    const resultado = await Tareas.create({tarea, estado, proyectoId});
    if(!resultado) {
        return next();
    };
    //Redireccionar
    res.redirect(`/proyectos/${req.params.url}`);
}

exports.cambiarEstadoTarea = async (req,res,next) => {
    const { id } = req.params;
    const tarea = await Tareas.findOne({where: {id: id}});
    
    //cambiar el estado
    let estado = 0;
    console.log("Tarea estado:", tarea.estado);
    if(tarea.estado === estado){
        estado = 1;
    }
    console.log("Estado desp del if: ", estado);
    tarea.estado = estado;
    console.log(tarea.estado);
    const resultado = await tarea.save();
    console.log(resultado);
    if (!resultado) return next();

    res.status(200).send('Actualizado');
}

exports.eliminarTarea = async (req,res,next) => {
    const { id } = req.params; 
    //Eliminar tarea
    const resultado = await Tareas.destroy({where: {id}});

    if (!resultado) return next();
    res.status(200).send('La tarea  ha sido eliminada');
}