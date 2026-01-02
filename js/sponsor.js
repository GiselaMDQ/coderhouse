// Manejar envío del formulario de sponsor
document.addEventListener('DOMContentLoaded', function() {
    const formularioSponsor = document.getElementById('formularioSponsor');
    
    if (formularioSponsor) {
        formularioSponsor.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validar que todos los campos requeridos estén completos
            const nombre = document.getElementById('nombreSponsor').value.trim();
            const empresa = document.getElementById('empresaSponsor').value.trim();
            const telefono = document.getElementById('telefonoSponsor').value.trim();
            const email = document.getElementById('emailSponsor').value.trim();
            
            if (!nombre || !empresa || !telefono || !email) {
                alert('Por favor, completa todos los campos requeridos.');
                return;
            }
            
            // Mostrar modal de confirmación
            const modal = new bootstrap.Modal(document.getElementById('modalConfirmacionSponsor'));
            modal.show();
            
            // Resetear el formulario
            formularioSponsor.reset();
        });
    }
});

