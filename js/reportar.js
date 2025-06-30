
let listaAnimales = [];


// const botonReportar = document.getElementById ("botonReportar")
// if (botonReportar)
    // Funcion mediante la que se ejecuta el evento sobre el boton "Reportar"

    document.getElementById("botonReportar").addEventListener("click", function() {
        console.log("Se ejecuta el boton reportar")
        reportar(listaAnimales);
        console.log(listaAnimales)
        
    });




//Funcion para reportar animales almacenando en un array y luego en LocalStorage

function reportar (listaAnimales) {

    //Obtener datos del formulario
    let situacion = document.querySelector ('input[name="opcionesRadio"]:checked');
    let selectTipoAnimal = document.querySelector("#tipoAnimalReportado");
    let tipoAnimal = selectTipoAnimal.value;
    let razaReportado = document.querySelector('#razaReportado');
    let nombreReportado = document.querySelector('#nombreReportado');
    let descripcionReportado = document.querySelector('#descripcionReportado');
    let errorDiv = document.getElementById("errorTipo");

    //Obtener animales guardados
    if (localStorage.getItem('animales')!==null)
        listaAnimales = JSON.parse(localStorage.getItem('animales'))

   //Crear y guardar animal + gestion de error ante radio button no seleccionado
    if (!situacion) {
        errorDiv.style.display = "block";
    } 
    else {
        let reportado = new Animal (situacion.value,tipoAnimal,razaReportado.value.toUpperCase(), descripcionReportado.value, nombreReportado.value);
        listaAnimales.push(reportado)
        guardarEnLocalStorage ("animales",listaAnimales)
       
        const modal = new bootstrap.Modal(document.getElementById('miModal'));
        modal.show();
        document.getElementById("formularioReportar").reset();
        errorDiv.style.display = "none";
    }
}



// Guardar en localStorage la informacion de animales perdidos y encontrados, para poder navegar el sitio sin perder la info
function guardarEnLocalStorage(clave, array) {
    localStorage.setItem(clave, JSON.stringify(array));
}





