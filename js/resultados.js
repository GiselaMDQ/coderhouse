document.addEventListener("DOMContentLoaded", function () {
        mostrarResultados();

});

const mostrarResultados = async () => {

    //Si ingresaron tipo PERO aun no se reportaron animales
    let sinReportados;
    let listaAnimales;

    // Cargar animales desde sessionStorage o desde JSON
    if (sessionStorage.getItem('animales') === null) {
        console.log("Cargando animales desde JSON...");
        listaAnimales = await traerListaDeAnimales();
    } else {
        console.log("Cargando animales desde sessionStorage...");
        listaAnimales = JSON.parse(sessionStorage.getItem('animales'));
    }

    console.log("Animales cargados:", listaAnimales);

    // Verificar si hay animales cargados
    if (!listaAnimales || listaAnimales.length === 0) {
        sinReportados = document.getElementById("errorSinReportados");
        sinReportados.textContent = "Aún no se han reportado animales";
        sinReportados.style.display = "block";
        return;
    }

    // Obtener el animal buscado
    let animalBuscadoStr = sessionStorage.getItem("animalBuscado");
    if (!animalBuscadoStr) {
        sinReportados = document.getElementById("errorSinReportados");
        sinReportados.textContent = "No se encontró información de búsqueda";
        sinReportados.style.display = "block";
        return;
    }

    let animalBuscado = JSON.parse(animalBuscadoStr);
    console.log("Animal buscado:", animalBuscado);

    // Filtrar animales: situación y tipoAnimal son obligatorios, raza es opcional
    let listaCoincidencias = listaAnimales.filter(animal => {
        let coincideSituacion = animal.situacion === animalBuscado.situacion;
        let coincideTipo = animal.tipoAnimal === animalBuscado.tipoAnimal;
        // Si no se especificó raza en la búsqueda, no filtrar por raza
        let coincideRaza = !animalBuscado.raza || animal.raza === animalBuscado.raza.toUpperCase();
        
        return coincideSituacion && coincideTipo && coincideRaza;
    });

    console.log("Coincidencias encontradas:", listaCoincidencias.length);

    if (listaCoincidencias.length === 0) {
        sinReportados = document.getElementById("errorSinReportados");
        sinReportados.textContent = "No hay animales con esas características";
        sinReportados.style.display = "block";
    } else {
        sessionStorage.setItem("listaCoincidencias", JSON.stringify(listaCoincidencias));
        crearTabla();
    }
    
    sessionStorage.removeItem("animalBuscado");
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
    try {
        const resultado = await fetch(URLlistaDeAnimales);
        if (!resultado.ok) {
            throw new Error(`Error al cargar el JSON: ${resultado.status}`);
        }
        let data = await resultado.json();
        guardarEnSessionStorage("animales", data);
        return data;
    } catch (error) {
        console.error("Error al cargar animales:", error);
        return [];
    }
}
    

function crearTabla () {
    
    let listaCoincidencias = JSON.parse (sessionStorage.getItem("listaCoincidencias"));
    let contenedor = document.getElementById("contenedorResultados");
    
    // Limpiar contenedor
    contenedor.innerHTML = '';
    
    // Crear contenedor de grid
    let gridContainer = document.createElement("div");
    gridContainer.className = "resultsGrid";
    
    listaCoincidencias.forEach(animal => {
        let probabilidad = calcularProbabilidad(animal);
        let probabilidadClass = probabilidad.toLowerCase();
        
        // Determinar icono según tipo de animal
        let iconoAnimal = animal.tipoAnimal === "Perro" ? "🐕" : "🐈";
        
        // Determinar badge de situación
        let situacionTexto = animal.situacion === "perdido" ? "Perdido" : "Encontrado";
        let situacionClass = animal.situacion === "perdido" ? "badge-perdido" : "badge-encontrado";
        
        // Crear card
        let card = document.createElement("div");
        card.className = "resultCard";
        
        card.innerHTML = `
            <div class="resultCardHeader">
                <div class="resultCardIcon">${iconoAnimal}</div>
                <div class="resultCardTitle">
                    <h3>${animal.nombre || "Sin nombre"}</h3>
                    <span class="badge ${situacionClass}">${situacionTexto}</span>
                </div>
            </div>
            <div class="resultCardBody">
                <div class="resultCardInfo">
                    <div class="infoItem">
                        <span class="infoLabel">Raza:</span>
                        <span class="infoValue">${animal.raza || "No especificada"}</span>
                    </div>
                    <div class="infoItem">
                        <span class="infoLabel">Tipo:</span>
                        <span class="infoValue">${animal.tipoAnimal}</span>
                    </div>
                    ${animal.descripcion ? `
                    <div class="infoItem">
                        <span class="infoLabel">Descripción:</span>
                        <span class="infoValue">${animal.descripcion}</span>
                    </div>
                    ` : ''}
                    <div class="infoItem">
                        <span class="infoLabel">Fecha:</span>
                        <span class="infoValue">${animal.fecha}</span>
                    </div>
                </div>
                <div class="resultCardFooter">
                    <div class="probabilidadBadge probabilidad-${probabilidadClass}">
                        <span class="probabilidadLabel">Probabilidad:</span>
                        <span class="probabilidadValue">${probabilidad}</span>
                    </div>
                </div>
            </div>
        `;
        
        gridContainer.appendChild(card);
    });
    
    contenedor.appendChild(gridContainer);
    sessionStorage.removeItem("listaCoincidencias");
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