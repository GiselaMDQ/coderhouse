document.addEventListener("DOMContentLoaded", function () {
    mostrarResultados();
});

const mostrarResultados = () => {
    // Obtener las coincidencias que fueron guardadas por buscar.js
    let listaCoincidenciasStr = sessionStorage.getItem("listaCoincidencias");
    
    if (!listaCoincidenciasStr) {
        const sinReportados = document.getElementById("errorSinReportados");
        if (sinReportados) {
            sinReportados.textContent = "No se encontró información de búsqueda. Por favor, realiza una búsqueda primero.";
            sinReportados.style.display = "block";
        }
        return;
    }

    let listaCoincidencias = JSON.parse(listaCoincidenciasStr);
    console.log("Coincidencias encontradas:", listaCoincidencias.length);

    if (!listaCoincidencias || listaCoincidencias.length === 0) {
        const sinReportados = document.getElementById("errorSinReportados");
        if (sinReportados) {
            sinReportados.textContent = "No hay animales con esas características";
            sinReportados.style.display = "block";
        }
    } else {
        crearTabla(listaCoincidencias);
    }
}

function crearTabla(listaCoincidencias) {
    let contenedor = document.getElementById("contenedorResultados");
    
    // Limpiar contenedor
    contenedor.innerHTML = '';
    
    // Ordenar animales por probabilidad: Alta primero, luego Media, luego Baja
    let animalesOrdenados = listaCoincidencias.sort((a, b) => {
        let probA = calcularProbabilidad(a);
        let probB = calcularProbabilidad(b);
        
        // Definir orden de prioridad
        const ordenProbabilidad = { "Alta": 1, "Media": 2, "Baja": 3 };
        
        return ordenProbabilidad[probA] - ordenProbabilidad[probB];
    });
    
    // Crear contenedor de grid
    let gridContainer = document.createElement("div");
    gridContainer.className = "resultsGrid";
    
    animalesOrdenados.forEach(animal => {
        let probabilidad = calcularProbabilidad(animal);
        let probabilidadClass = probabilidad.toLowerCase();
        
        // Determinar icono según tipo de animal (solo si no hay foto)
        let iconoAnimal = animal.tipoAnimal === "Perro" ? "🐕" : "🐈";
        
        // Determinar badge de situación
        let situacionTexto = animal.situacion === "perdido" ? "Perdido" : "Encontrado";
        let situacionClass = animal.situacion === "perdido" ? "badge-perdido" : "badge-encontrado";
        
        // Crear card
        let card = document.createElement("div");
        card.className = "resultCard";
        
        // Mostrar foto si existe, sino mostrar emoji
        let imagenHTML = '';
        if (animal.foto) {
            imagenHTML = `<img src="${animal.foto}" alt="Foto de ${animal.nombre || 'animal'}" class="resultCardImage clickeable" data-imagen="${animal.foto}" data-nombre="${animal.nombre || 'animal'}">`;
        } else {
            imagenHTML = `<div class="resultCardIcon">${iconoAnimal}</div>`;
        }
        
        card.innerHTML = `
            <div class="resultCardHeader">
                ${imagenHTML}
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
    
    // Agregar event listeners a las imágenes para ampliarlas
    document.querySelectorAll('.resultCardImage.clickeable').forEach(img => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', function() {
            const imagenSrc = this.getAttribute('data-imagen');
            const nombreAnimal = this.getAttribute('data-nombre');
            
            // Configurar el modal
            const modalImagen = document.getElementById('imagenAmpliada');
            const modalTitulo = document.getElementById('modalImagenTitulo');
            
            if (modalImagen && modalTitulo) {
                modalImagen.src = imagenSrc;
                modalTitulo.textContent = `Foto de ${nombreAnimal}`;
                
                // Mostrar el modal usando Bootstrap
                const modal = new bootstrap.Modal(document.getElementById('modalImagenAmpliada'));
                modal.show();
            }
        });
    });
    
    // Limpiar sessionStorage después de mostrar los resultados
    sessionStorage.removeItem("listaCoincidencias");
}

function calcularProbabilidad(animal) {
    let hoy = dayjs();
    let fechaAnimal = dayjs(animal.fecha);
    let diferencia = hoy.diff(fechaAnimal, 'day');
    if (diferencia <= 5)
        return "Alta";
    else if (diferencia <= 10)
        return "Media";
    else 
        return "Baja";
}
