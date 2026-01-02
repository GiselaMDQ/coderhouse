// Manejar envío del formulario de contacto
document.addEventListener('DOMContentLoaded', function() {
    const formularioContacto = document.getElementById('formularioContacto');
    
    if (formularioContacto) {
        formularioContacto.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validar que todos los campos requeridos estén completos
            const nombre = document.getElementById('nombreContacto').value.trim();
            const telefono = document.getElementById('telefonoContacto').value.trim();
            const email = document.getElementById('emailContacto').value.trim();
            const propuesta = document.getElementById('propuestaContacto').value.trim();
            
            if (!nombre || !telefono || !email || !propuesta) {
                alert('Por favor, completa todos los campos requeridos.');
                return;
            }
            
            // Mostrar modal de confirmación
            const modal = new bootstrap.Modal(document.getElementById('modalConfirmacionContacto'));
            modal.show();
            
            // Resetear el formulario
            formularioContacto.reset();
        });
    }
});

