// Función para cargar contenido dinámicamente
function loadContent(section) {
    fetch(`${section}.html`) // Asegúrate de que los archivos existan y estén nombrados correctamente
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar la página');
            }
            return response.text();
        })
        .then(html => {
            document.getElementById('content').innerHTML = html; // Inserta el HTML cargado en el contenedor
        })
        .catch(error => {
            document.getElementById('content').innerHTML = `<h2>Error: ${error.message}</h2>`;
        });
}

// Función para gestionar la navegación
function navigate(sectionId) {
    loadContent(sectionId); // Carga el contenido de la sección deseada
    history.pushState(null, '', sectionId); // Cambia la URL sin recargar la página
}

// Al cargar la página, muestra la sección basada en la URL actual
window.addEventListener('load', () => {
    let currentPath = window.location.pathname.split('/').pop(); // Obtiene el nombre del archivo actual
    let currentSection = currentPath ? currentPath.split('.')[0] : 'home'; // Carga "home" por defecto
    loadContent(currentSection); // Carga el contenido inicial
});

// Maneja la navegación hacia atrás o adelante en el historial
window.addEventListener('popstate', () => {
    let section = window.location.pathname.split('/').pop().split('.')[0]; // Extrae la sección de la URL
    loadContent(section); // Carga el contenido correspondiente
});
