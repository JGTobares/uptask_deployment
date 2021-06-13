import Swal from 'sweetalert2';

export const actualizarAvance = () => {
    //Seleccionar tareas existentes
    const tareas = document.querySelectorAll('li.tarea');

    if(tareas.length) {
    //Seleccionar tareas completadas
        const tareasCompletadas = document.querySelectorAll('i.completo');
    //Calcular avance
        const avance = Math.round((tareasCompletadas.length / tareas.length) * 100) ;
    //Mostrar avance
        const porcentaje = document.querySelector('#porcentaje');
        porcentaje.style.width = avance+'%';
    
        if(avance === 100){
            Swal.fire(
                'Proyecto Completado!',
                'Felicidades has terminado tus tareas',
                'success'
            )
        }
    }
} 