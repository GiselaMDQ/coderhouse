let mapBuscar = null;
let markerBuscar = null;
let userLocationBuscar = null;

// Inicializar mapa para buscar
function initMapBuscar() {
    // Verificar que el contenedor del mapa existe
    const mapContainer = document.getElementById('mapBuscar');
    if (!mapContainer) {
        console.error('Contenedor del mapa no encontrado');
        return;
    }

    // Coordenadas por defecto (Argentina - Buenos Aires)
    const defaultLat = -34.6037;
    const defaultLng = -58.3816;
    const defaultZoom = 13;

    try {
        // Crear mapa
        mapBuscar = L.map('mapBuscar').setView([defaultLat, defaultLng], defaultZoom);

        // Agregar capa de tiles (OpenStreetMap)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
        }).addTo(mapBuscar);

        // Forzar actualización del mapa después de que se renderice
        setTimeout(() => {
            mapBuscar.invalidateSize();
        }, 100);

        // Permitir hacer clic en el mapa para seleccionar ubicación
        mapBuscar.on('click', function(e) {
            const lat = e.latlng.lat;
            const lng = e.latlng.lng;
            setLocationBuscar(lat, lng);
        });

        // Intentar obtener ubicación del usuario al cargar (con delay para asegurar que el mapa esté listo)
        setTimeout(() => {
            getCurrentLocationBuscar();
        }, 200);
    } catch (error) {
        console.error('Error al inicializar el mapa:', error);
        const locationStatus = document.getElementById('locationStatusBuscar');
        if (locationStatus) {
            locationStatus.textContent = 'Error al cargar el mapa. Por favor, recarga la página.';
            locationStatus.style.color = '#dc3545';
        }
    }
}

// Obtener ubicación actual del usuario
function getCurrentLocationBuscar() {
    const locationStatus = document.getElementById('locationStatusBuscar');
    
    if (!navigator.geolocation) {
        if (locationStatus) {
            locationStatus.textContent = 'La geolocalización no está disponible en tu navegador';
            locationStatus.style.color = '#dc3545';
        }
        return;
    }

    if (locationStatus) {
        locationStatus.textContent = 'Obteniendo tu ubicación...';
        locationStatus.style.color = '#80aa9f';
    }

    navigator.geolocation.getCurrentPosition(
        function(position) {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            userLocationBuscar = { lat, lng };
            
            if (mapBuscar) {
                setLocationBuscar(lat, lng);
                if (locationStatus) {
                    locationStatus.textContent = 'Ubicación obtenida correctamente';
                    locationStatus.style.color = '#28a745';
                }
            } else {
                console.error('El mapa no está inicializado');
                if (locationStatus) {
                    locationStatus.textContent = 'Error: el mapa no está listo. Por favor, recarga la página.';
                    locationStatus.style.color = '#dc3545';
                }
            }
        },
        function(error) {
            let errorMessage = 'No se pudo obtener tu ubicación. Haz clic en el mapa para seleccionar una ubicación.';
            
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    errorMessage = 'Permiso de geolocalización denegado. Por favor, habilita la ubicación en tu navegador o haz clic en el mapa.';
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMessage = 'Ubicación no disponible. Haz clic en el mapa para seleccionar una ubicación.';
                    break;
                case error.TIMEOUT:
                    errorMessage = 'Tiempo de espera agotado. Haz clic en el mapa para seleccionar una ubicación.';
                    break;
            }
            
            if (locationStatus) {
                locationStatus.textContent = errorMessage;
                locationStatus.style.color = '#ffc107';
            }
            console.error('Error obteniendo ubicación:', error);
        },
        {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 60000 // Cachear ubicación por 1 minuto
        }
    );
}

// Establecer ubicación en el mapa
function setLocationBuscar(lat, lng) {
    if (!mapBuscar) {
        console.error('El mapa no está inicializado');
        return;
    }

    // Actualizar campos ocultos
    const latInput = document.getElementById('latitudBuscar');
    const lngInput = document.getElementById('longitudBuscar');
    
    if (latInput) latInput.value = lat;
    if (lngInput) lngInput.value = lng;

    // Remover marcador anterior si existe
    if (markerBuscar) {
        mapBuscar.removeLayer(markerBuscar);
        markerBuscar = null;
    }

    // Crear icono personalizado
    const defaultIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    // Agregar nuevo marcador
    try {
        markerBuscar = L.marker([lat, lng], {
            draggable: true,
            icon: defaultIcon
        }).addTo(mapBuscar);

        // Centrar mapa en la ubicación
        mapBuscar.setView([lat, lng], 15);

        // Forzar actualización del tamaño del mapa
        setTimeout(() => {
            mapBuscar.invalidateSize();
        }, 100);

        // Permitir arrastrar el marcador
        markerBuscar.on('dragend', function(e) {
            const position = markerBuscar.getLatLng();
            if (latInput) latInput.value = position.lat;
            if (lngInput) lngInput.value = position.lng;
            
            const locationStatus = document.getElementById('locationStatusBuscar');
            if (locationStatus) {
                locationStatus.textContent = `Ubicación actualizada: ${position.lat.toFixed(6)}, ${position.lng.toFixed(6)}`;
                locationStatus.style.color = '#28a745';
            }
        });

        // Actualizar estado
        const locationStatus = document.getElementById('locationStatusBuscar');
        if (locationStatus) {
            locationStatus.textContent = `Ubicación seleccionada: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;
            locationStatus.style.color = '#28a745';
        }
    } catch (error) {
        console.error('Error al establecer ubicación en el mapa:', error);
    }
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

// URL del backend
const API_URL = 'http://localhost:3000/api';

// Manejar envío del formulario
document.getElementById("formularioBuscar").addEventListener("submit", async function (e) {
    e.preventDefault(); // Prevenir envío normal del formulario
    
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
        return;
    }

    // Obtener ubicación (opcional)
    let latitud = document.getElementById('latitudBuscar').value;
    let longitud = document.getElementById('longitudBuscar').value;

    // Construir parámetros de búsqueda
    const params = new URLSearchParams({
        situacion: situacion,
        tipoAnimal: tipoAnimal
    });

    // Agregar parámetros opcionales si existen
    if (raza && raza.value) {
        params.append('raza', raza.value);
    }
    if (latitud) {
        params.append('latitud', latitud);
    }
    if (longitud) {
        params.append('longitud', longitud);
    }

    // Buscar animales en el backend
    try {
        const response = await fetch(`${API_URL}/animales/buscar?${params.toString()}`);
        
        if (response.ok) {
            const coincidencias = await response.json();
            console.log('Coincidencias encontradas:', coincidencias);
            
            // Guardar resultados en sessionStorage para que resultados.html los use
            sessionStorage.setItem("listaCoincidencias", JSON.stringify(coincidencias));
            
            // Redirigir a resultados.html
            window.location.href = 'resultados.html';
        } else {
            const error = await response.json();
            console.error('Error al buscar:', error);
            alert('Error al buscar animales. Por favor, intenta nuevamente.');
        }
    } catch (error) {
        console.error('Error de conexión:', error);
        alert('Error de conexión con el servidor. Por favor, verifica que el servidor esté corriendo.');
    }
});

