document.addEventListener("DOMContentLoaded", function () {
        mostrarResultados();

});

function mostrarResultados () {

 //Si ingresaron tipo PERO aun no se reportaron animales
    let sinReportados;

        if (localStorage.getItem('animales') === null) {
            sinReportados = document.getElementById("errorSinReportados")
            sinReportados.style.display = "block"
        }
        else { //Si hay animales reportados
            let listaAnimales = JSON.parse(localStorage.getItem('animales'))
            let animalBuscado = JSON.parse (localStorage.getItem("animalBuscado"))
            let listaCoincidencias = listaAnimales.filter (
                animal => animal.situacion === animalBuscado.situacion && animal.tipoAnimal === animalBuscado.tipoAnimal && animal.raza === animalBuscado.raza.toUpperCase()
            )
            if (listaCoincidencias.length === 0) {
                sinReportados = document.getElementById("errorSinReportados")
                sinReportados.textContent = "No hay animales con esas caracteristicas"
                sinReportados.style.display = "block"
            }
            else {
                localStorage.setItem("listaCoincidencias",JSON.stringify(listaCoincidencias))
                crearTabla();
            }
            localStorage.removeItem("animalBuscado")
        }
            
       
        
        }
    

function crearTabla () {
    
    let listaCoincidencias = JSON.parse (localStorage.getItem("listaCoincidencias"))
    let tabla = document.createElement("table");

    tabla.className = "table table-striped";

    // Crear encabezado
    let thead = document.createElement("thead");
    thead.innerHTML = `
        <tr>
            <th>Situacion</th>
            <th>Raza</th>
            <th>Descripción</th>
            <th>Nombre</th>
        </tr>
    `;
    tabla.appendChild(thead);

    // Crear cuerpo de tabla
    let tbody = document.createElement("tbody");
    listaCoincidencias.forEach(animal => {
        let fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${animal.situacion}</td>
            <td>${animal.raza}</td>
            <td>${animal.descripcion}</td>
            <td>${animal.nombre}</td>
        `;

        tbody.appendChild(fila);
    });

    tabla.appendChild(tbody);
    document.getElementById("contenedorResultados").appendChild(tabla);
    localStorage.removeItem("listaCoincidencias")

}