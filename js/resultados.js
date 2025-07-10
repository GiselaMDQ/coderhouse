document.addEventListener("DOMContentLoaded", function () {
        mostrarResultados();

});

const mostrarResultados = async () => {

 //Si ingresaron tipo PERO aun no se reportaron animales
    let sinReportados;

    if (sessionStorage.getItem('animales')===null) 
        listaAnimales = await traerListaDeAnimales()
    else
        listaAnimales = JSON.parse(sessionStorage.getItem('animales'))
  

        if (listaAnimales === null) {
            sinReportados = document.getElementById("errorSinReportados")
            sinReportados.style.display = "block"
        }
        else {
            let animalBuscado = JSON.parse (sessionStorage.getItem("animalBuscado"))

            let listaCoincidencias = listaAnimales.filter (
                animal => animal.situacion === animalBuscado.situacion && animal.tipoAnimal === animalBuscado.tipoAnimal && animal.raza === animalBuscado.raza
            )
            if (listaCoincidencias.length === 0) {
                sinReportados = document.getElementById("errorSinReportados")
                sinReportados.textContent = "No hay animales con esas caracteristicas"
                sinReportados.style.display = "block"
            }
            else {
                sessionStorage.setItem("listaCoincidencias",JSON.stringify(listaCoincidencias))
                debugger
                crearTabla();
            }
            sessionStorage.removeItem("animalBuscado")
        }
        }

        // if (localStorage.getItem('animales') === null) {
        //     sinReportados = document.getElementById("errorSinReportados")
        //     sinReportados.style.display = "block"
        // }
        // else { //Si hay animales reportados
        //     //let listaAnimales = JSON.parse(localStorage.getItem('animales'))

        //     let animalBuscado = JSON.parse (localStorage.getItem("animalBuscado"))
            
        //     let listaCoincidencias = listaAnimales.filter (
        //         animal => animal.situacion === animalBuscado.situacion && animal.tipoAnimal === animalBuscado.tipoAnimal && animal.raza === animalBuscado.raza.toUpperCase()
        //     )
        //     if (listaCoincidencias.length === 0) {
        //         sinReportados = document.getElementById("errorSinReportados")
        //         sinReportados.textContent = "No hay animales con esas caracteristicas"
        //         sinReportados.style.display = "block"
        //     }
        //     else {
        //         localStorage.setItem("listaCoincidencias",JSON.stringify(listaCoincidencias))
        //         crearTabla();
        //     }
        //     localStorage.removeItem("animalBuscado")
        // }
            
       
        




const URLlistaDeAnimales = "../json/Animales.json";


const traerListaDeAnimales = async () => {
    const resultado = await fetch (URLlistaDeAnimales)
    let data = await resultado.json()
    debugger
    guardarEnSessionStorage("animales",data)
    return data
}
    

function crearTabla () {
    
    let listaCoincidencias = JSON.parse (sessionStorage.getItem("listaCoincidencias"))
   
    let tabla = document.createElement("table");

    tabla.className = "table table-bordered";

    // Crear encabezado
    let thead = document.createElement("thead");
   
    thead.innerHTML = `
        <tr class="bg-success text-white">
            <th>Situacion</th>
            <th>Raza</th>
            <th>Descripción</th>
            <th>Nombre</th>
            <th>Fecha</th>
            <th>% Match</th>
        </tr>
    `;
    tabla.appendChild(thead);

    // Crear cuerpo de tabla
    let tbody = document.createElement("tbody");
    listaCoincidencias.forEach(animal => {
        let fila = document.createElement("tr");
        let probabilidad = calcularProbabilidad (animal)
        debugger

        fila.innerHTML = `
            <td>${animal.situacion}</td>
            <td>${animal.raza}</td>
            <td>${animal.descripcion}</td>
            <td>${animal.nombre}</td>
             <td>${animal.fecha}</td>
            <td>${probabilidad}</td>
        `;

        tbody.appendChild(fila);
    });

    tabla.appendChild(tbody);
    document.getElementById("contenedorResultados").appendChild(tabla);
    sessionStorage.removeItem("listaCoincidencias")

}

// Guardar en sessionStorage la informacion de animales perdidos y encontrados, para poder navegar el sitio sin perder la info
function guardarEnSessionStorage(clave, array) {
    sessionStorage.setItem(clave, JSON.stringify(array));
}

function calcularProbabilidad (animal) {
    let hoy = dayjs()
    let fechaAnimal = dayjs(animal.fecha);
    let diferencia = hoy.diff(fechaAnimal,'day')
    if (diferencia <= 5)
        return "Alta"
    else
        if (diferencia <=10)
            return "Media"
        else 
            return "Baja"

}