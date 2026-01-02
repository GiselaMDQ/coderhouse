let mapBuscar = null;
let markerBuscar = null;
let userLocationBuscar = null;

// Inicializar mapa para buscar
function initMapBuscar() {
    // Coordenadas por defecto (Argentina - Buenos Aires)
    const defaultLat = -34.6037;
    const defaultLng = -58.3816;
    const defaultZoom = 13;

    // Crear mapa
    mapBuscar = L.map('mapBuscar').setView([defaultLat, defaultLng], defaultZoom);

    // Agregar capa de tiles (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(mapBuscar);

    // Permitir hacer clic en el mapa para seleccionar ubicación
    mapBuscar.on('click', function(e) {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;
        setLocationBuscar(lat, lng);
    });

    // Intentar obtener ubicación del usuario al cargar
    getCurrentLocationBuscar();
}

// Obtener ubicación actual del usuario
function getCurrentLocationBuscar() {
    const locationStatus = document.getElementById('locationStatusBuscar');
    
    if (!navigator.geolocation) {
        locationStatus.textContent = 'La geolocalización no está disponible en tu navegador';
        locationStatus.style.color = '#dc3545';
        return;
    }

    locationStatus.textContent = 'Obteniendo tu ubicación...';
    locationStatus.style.color = '#80aa9f';

    navigator.geolocation.getCurrentPosition(
        function(position) {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            userLocationBuscar = { lat, lng };
            setLocationBuscar(lat, lng);
            locationStatus.textContent = 'Ubicación obtenida correctamente';
            locationStatus.style.color = '#28a745';
        },
        function(error) {
            locationStatus.textContent = 'No se pudo obtener tu ubicación. Haz clic en el mapa para seleccionar una ubicación.';
            locationStatus.style.color = '#ffc107';
            console.error('Error obteniendo ubicación:', error);
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
}

// Establecer ubicación en el mapa
function setLocationBuscar(lat, lng) {
    // Actualizar campos ocultos
    document.getElementById('latitudBuscar').value = lat;
    document.getElementById('longitudBuscar').value = lng;

    // Remover marcador anterior si existe
    if (markerBuscar) {
        mapBuscar.removeLayer(markerBuscar);
    }

    // Agregar nuevo marcador
    markerBuscar = L.marker([lat, lng], {
        draggable: true,
        icon: L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        })
    }).addTo(mapBuscar);

    // Centrar mapa en la ubicación
    mapBuscar.setView([lat, lng], 15);

    // Permitir arrastrar el marcador
    markerBuscar.on('dragend', function(e) {
        const position = markerBuscar.getLatLng();
        document.getElementById('latitudBuscar').value = position.lat;
        document.getElementById('longitudBuscar').value = position.lng;
    });

    // Actualizar estado
    const locationStatus = document.getElementById('locationStatusBuscar');
    locationStatus.textContent = `Ubicación seleccionada: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    locationStatus.style.color = '#28a745';
}

// Funcionalidad para las cards de selección
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar mapa
    initMapBuscar();

    // Manejar clicks en las cards de tipo de animal (Perro/Gato)
    document.querySelectorAll('.petCard').forEach(card => {
        card.addEventListener('click', function() {
            // Remover selección de otras cards de tipo
            document.querySelectorAll('.petCard').forEach(c => {
                c.classList.remove('selected');
                c.querySelector('input[type="radio"]').checked = false;
            });
            // Seleccionar esta card
            this.classList.add('selected');
            this.querySelector('input[type="radio"]').checked = true;
        });
    });

    // Botón para usar ubicación actual
    const btnUbicacionActual = document.getElementById('btnUbicacionActualBuscar');
    if (btnUbicacionActual) {
        btnUbicacionActual.addEventListener('click', function() {
            if (userLocationBuscar) {
                setLocationBuscar(userLocationBuscar.lat, userLocationBuscar.lng);
            } else {
                getCurrentLocationBuscar();
            }
        });
    }
});

// Manejar envío del formulario
document.getElementById("formularioBuscar").addEventListener("submit", function (e) {
    let situacionSelect = document.querySelector('#situacionSelectBuscar');
    let situacion = situacionSelect && situacionSelect.value ? situacionSelect.value : null;
    let tipoAnimalRadio = document.querySelector('input[name="tipoAnimalBuscar"]:checked');
    let tipoAnimal = tipoAnimalRadio ? tipoAnimalRadio.value : "";
    let raza = document.querySelector('#razaBuscado');
    let errorDiv = document.getElementById("errorTipoBuscar");
    let errorTipoAnimal = document.getElementById("errorTipoAnimalBuscar");
    
    let hasErrors = false;
    
    // Validar situación
    if (!situacion) {
        errorDiv.style.display = "block";
        hasErrors = true;
    } else {
        errorDiv.style.display = "none";
    }

    // Validar tipo de animal
    if (!tipoAnimalRadio || tipoAnimal === "") {
        if (errorTipoAnimal) {
            errorTipoAnimal.style.display = "block";
        }
        hasErrors = true;
    } else {
        if (errorTipoAnimal) {
            errorTipoAnimal.style.display = "none";
        }
    }

    if (hasErrors) {
        e.preventDefault();
        return;
    }

    // Obtener ubicación (opcional)
    let latitud = document.getElementById('latitudBuscar').value;
    let longitud = document.getElementById('longitudBuscar').value;

    // Si todo está bien, crear el animal buscado y guardar
    let animalBuscado = new Animal(
        situacion,
        tipoAnimal,
        raza.value ? raza.value.toUpperCase() : "",
        "",
        "",
        "",
        latitud || "",
        longitud || ""
    );

    sessionStorage.setItem("animalBuscado", JSON.stringify(animalBuscado));
    
    // El formulario se enviará normalmente a resultados.html
});

