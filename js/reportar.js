
let listaAnimales = [];
let map = null;
let marker = null;
let userLocation = null;

// Inicializar mapa
function initMap() {
    // Coordenadas por defecto (Argentina - Buenos Aires)
    const defaultLat = -34.6037;
    const defaultLng = -58.3816;
    const defaultZoom = 13;

    // Crear mapa
    map = L.map('map').setView([defaultLat, defaultLng], defaultZoom);

    // Agregar capa de tiles (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);

    // Permitir hacer clic en el mapa para seleccionar ubicación
    map.on('click', function(e) {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;
        setLocation(lat, lng);
    });

    // Intentar obtener ubicación del usuario al cargar
    getCurrentLocation();
}

// Obtener ubicación actual del usuario
function getCurrentLocation() {
    const locationStatus = document.getElementById('locationStatus');
    
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
            userLocation = { lat, lng };
            setLocation(lat, lng);
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
function setLocation(lat, lng) {
    // Actualizar campos ocultos
    document.getElementById('latitud').value = lat;
    document.getElementById('longitud').value = lng;

    // Remover marcador anterior si existe
    if (marker) {
        map.removeLayer(marker);
    }

    // Agregar nuevo marcador
    marker = L.marker([lat, lng], {
        draggable: true,
        icon: L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        })
    }).addTo(map);

    // Centrar mapa en la ubicación
    map.setView([lat, lng], 15);

    // Permitir arrastrar el marcador
    marker.on('dragend', function(e) {
        const position = marker.getLatLng();
        document.getElementById('latitud').value = position.lat;
        document.getElementById('longitud').value = position.lng;
    });

    // Actualizar estado
    const locationStatus = document.getElementById('locationStatus');
    locationStatus.textContent = `Ubicación seleccionada: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    locationStatus.style.color = '#28a745';
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
    reportar(listaAnimales);
    console.log(listaAnimales)
});


const URLlistaDeAnimales = "../json/Animales.json";


const traerListaDeAnimales = async () => {
    const resultado = await fetch (URLlistaDeAnimales)
    let data = await resultado.json()
    guardarEnSessionStorage("animales",data)
    return data
}
 


//Funcion para reportar animales almacenando en un array y luego en sessionStorage

const reportar = async (listaAnimales) => {

    //Obtener datos del formulario
    let situacionSelect = document.querySelector('#situacionSelect');
    let situacion = situacionSelect && situacionSelect.value ? { value: situacionSelect.value } : null;
    let tipoAnimalRadio = document.querySelector('input[name="tipoAnimal"]:checked');
    let tipoAnimal = tipoAnimalRadio ? tipoAnimalRadio.value : "";
    let razaReportado = document.querySelector('#razaReportado');
    let nombreReportado = document.querySelector('#nombreReportado');
    let descripcionReportado = document.querySelector('#descripcionReportado');
    let errorDiv = document.getElementById("errorTipo");
    let fecha = dayjs().format('MM/DD/YYYY');


    //Obtener animales guardados
    if (sessionStorage.getItem('animales')===null) 
        listaAnimales = await traerListaDeAnimales()
    else
        listaAnimales = JSON.parse(sessionStorage.getItem('animales'))
       

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
        let reportado = new Animal (
            situacion.value,
            tipoAnimal,
            razaReportado.value.toUpperCase(),
            descripcionReportado.value,
            nombreReportado.value,
            fecha,
            latitud || "",
            longitud || ""
        );
        listaAnimales.push(reportado)
        guardarEnSessionStorage ("animales",listaAnimales)
       
        const modal = new bootstrap.Modal(document.getElementById('miModal'));
        modal.show();
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
    }
}



// Guardar en sessionStorage la informacion de animales perdidos y encontrados, para poder navegar el sitio sin perder la info
function guardarEnSessionStorage(clave, array) {
    sessionStorage.setItem(clave, JSON.stringify(array));
}




