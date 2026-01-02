
let map = null;
let marker = null;
let userLocation = null;

// Inicializar mapa
function initMap() {
    // Verificar que el contenedor del mapa existe
    const mapContainer = document.getElementById('map');
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
        map = L.map('map').setView([defaultLat, defaultLng], defaultZoom);

        // Agregar capa de tiles (OpenStreetMap)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
        }).addTo(map);

        // Forzar actualización del mapa después de que se renderice
        setTimeout(() => {
            map.invalidateSize();
        }, 100);

        // Permitir hacer clic en el mapa para seleccionar ubicación
        map.on('click', function(e) {
            const lat = e.latlng.lat;
            const lng = e.latlng.lng;
            setLocation(lat, lng);
        });

        // Intentar obtener ubicación del usuario al cargar (con delay para asegurar que el mapa esté listo)
        setTimeout(() => {
            getCurrentLocation();
        }, 200);
    } catch (error) {
        console.error('Error al inicializar el mapa:', error);
        const locationStatus = document.getElementById('locationStatus');
        if (locationStatus) {
            locationStatus.textContent = 'Error al cargar el mapa. Por favor, recarga la página.';
            locationStatus.style.color = '#dc3545';
        }
    }
}

// Obtener ubicación actual del usuario
function getCurrentLocation() {
    const locationStatus = document.getElementById('locationStatus');
    
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
            userLocation = { lat, lng };
            
            if (map) {
                setLocation(lat, lng);
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
function setLocation(lat, lng) {
    if (!map) {
        console.error('El mapa no está inicializado');
        return;
    }

    // Actualizar campos ocultos
    const latInput = document.getElementById('latitud');
    const lngInput = document.getElementById('longitud');
    
    if (latInput) latInput.value = lat;
    if (lngInput) lngInput.value = lng;

    // Remover marcador anterior si existe
    if (marker) {
        map.removeLayer(marker);
        marker = null;
    }

    // Crear icono personalizado (con fallback si la URL falla)
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
        marker = L.marker([lat, lng], {
            draggable: true,
            icon: defaultIcon
        }).addTo(map);

        // Centrar mapa en la ubicación
        map.setView([lat, lng], 15);

        // Forzar actualización del tamaño del mapa
        setTimeout(() => {
            map.invalidateSize();
        }, 100);

        // Permitir arrastrar el marcador
        marker.on('dragend', function(e) {
            const position = marker.getLatLng();
            if (latInput) latInput.value = position.lat;
            if (lngInput) lngInput.value = position.lng;
            
            const locationStatus = document.getElementById('locationStatus');
            if (locationStatus) {
                locationStatus.textContent = `Ubicación actualizada: ${position.lat.toFixed(6)}, ${position.lng.toFixed(6)}`;
                locationStatus.style.color = '#28a745';
            }
        });

        // Actualizar estado
        const locationStatus = document.getElementById('locationStatus');
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
    initMap();

    // Botón para usar ubicación actual
    const btnUbicacionActual = document.getElementById('btnUbicacionActual');
    if (btnUbicacionActual) {
        btnUbicacionActual.addEventListener('click', function() {
            if (userLocation) {
                setLocation(userLocation.lat, userLocation.lng);
            } else {
                getCurrentLocation();
            }
        });
    }
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

    // Preview de imagen
    const fileInput = document.getElementById('fotoReportado');
    const preview = document.getElementById('filePreview');
    const previewImage = document.getElementById('previewImage');

    if (fileInput && preview && previewImage) {
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    previewImage.src = e.target.result;
                    preview.style.display = 'block';
                };
                reader.readAsDataURL(file);
            } else {
                preview.style.display = 'none';
            }
        });
    }
});

    // Funcion mediante la que se ejecuta el evento sobre el boton "Reportar"
    document.getElementById("botonReportar").addEventListener("click", function() {
        console.log("Se ejecuta el boton reportar")
        reportar();
    });

// URL del backend
const API_URL = 'http://localhost:3000/api';

//Funcion para reportar animales enviando al backend
const reportar = async () => {
    //Obtener datos del formulario
    let situacionSelect = document.querySelector('#situacionSelect');
    let situacion = situacionSelect && situacionSelect.value ? situacionSelect.value : null;
    let tipoAnimalRadio = document.querySelector('input[name="tipoAnimal"]:checked');
    let tipoAnimal = tipoAnimalRadio ? tipoAnimalRadio.value : "";
    let razaReportado = document.querySelector('#razaReportado');
    let nombreReportado = document.querySelector('#nombreReportado');
    let descripcionReportado = document.querySelector('#descripcionReportado');
    let errorDiv = document.getElementById("errorTipo");
    let fecha = dayjs().format('MM/DD/YYYY');

   //Crear y guardar animal + gestion de error ante campos obligatorios no seleccionados
    let errorTipoAnimal = document.getElementById("errorTipoAnimal");
    let hasErrors = false;

    if (!situacion) {
        errorDiv.style.display = "block";
        hasErrors = true;
    } else {
        errorDiv.style.display = "none";
    }

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

    // Obtener ubicación (opcional)
    let latitud = document.getElementById('latitud').value;
    let longitud = document.getElementById('longitud').value;

    if (!hasErrors) {
        // Obtener foto si existe y convertirla a base64
        let fotoBase64 = "";
        const fileInput = document.getElementById('fotoReportado');
        if (fileInput && fileInput.files && fileInput.files[0]) {
            const file = fileInput.files[0];
            fotoBase64 = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        }

        // Crear objeto animal
        let reportado = new Animal (
            situacion,
            tipoAnimal,
            razaReportado.value ? razaReportado.value.toUpperCase() : "",
            descripcionReportado.value || "",
            nombreReportado.value || "",
            fecha,
            latitud || "",
            longitud || ""
        );

        // Agregar foto al objeto si existe
        if (fotoBase64) {
            reportado.foto = fotoBase64;
        }

        // Enviar al backend
        try {
            const response = await fetch(`${API_URL}/animales`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(reportado)
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Animal guardado:', result);
                
                // Mostrar modal de confirmación
                const modal = new bootstrap.Modal(document.getElementById('miModal'));
                modal.show();
                
                // Resetear formulario
                document.getElementById("formularioReportar").reset();
                // Resetear las cards visualmente (solo las de tipo de animal)
                document.querySelectorAll('.petCard').forEach(card => {
                    card.classList.remove('selected');
                });
                // Resetear preview de imagen
                const preview = document.getElementById('filePreview');
                if (preview) {
                    preview.style.display = 'none';
                }
                // Resetear mapa
                if (marker) {
                    map.removeLayer(marker);
                    marker = null;
                }
                document.getElementById('latitud').value = '';
                document.getElementById('longitud').value = '';
                const locationStatus = document.getElementById('locationStatus');
                if (locationStatus) {
                    locationStatus.textContent = 'Haz clic en el mapa o usa tu ubicación actual';
                    locationStatus.style.color = '#383938';
                }
            } else {
                const error = await response.json();
                console.error('Error al guardar:', error);
                alert('Error al guardar el animal. Por favor, intenta nuevamente.');
            }
        } catch (error) {
            console.error('Error al enviar al backend:', error);
            alert('Error de conexión con el servidor. Por favor, verifica que el servidor esté corriendo.');
        }
    }
}





