function crearCarta(tipo, delay) {
    const card = document.createElement('div');
    card.className = 'card';

    const cardHeader = document.createElement('div');
    cardHeader.className = 'card-header';
    cardHeader.textContent = tipo;

    let description;
    switch (tipo) {
        case 'Daño':
            description = 'Golpeas al enemigo'; break;
        case 'Curación':
            description = 'Te curas puntos de vida'; break;
        case 'Defensa':
            description = 'Te defiendes del golpe del enemigo'; break;
        case 'Fuego':
            description = 'Golpeas con magia al enemigo. Puede ser que le quemes'; break;
        case 'Hielo':
            description = 'Golpeas con magia al enemigo. Puede ser que le congeles'; break;
        default:
            description = 'Acción desconocida'; // Para manejo de errores
    }

    const cardDescription = document.createElement('div');
    cardDescription.className = 'card-description';
    cardDescription.textContent = description;

    const cardValue = document.createElement('div');
    cardValue.className = 'card-value';
    cardValue.textContent = Math.floor(Math.random() * (10 - 5 + 1)) + 5;

    card.appendChild(cardHeader);
    card.appendChild(cardDescription);
    card.appendChild(cardValue);
    card.addEventListener('click', atacar);

    const hand = document.getElementById('hand');
    hand.appendChild(card);

    // Agregar clase visible con un pequeño retraso para animación
    setTimeout(() => {
        card.classList.add('visible');
    }, delay);

    return card;
}

function generarCartas() {
    const hand = document.getElementById('hand');
    hand.innerHTML = ''; // Limpiar cartas previas
    const tipos = ['Daño', 'Curación', 'Defensa', 'Hielo', 'Fuego'];

    for (let i = 0; i < 6; i++) {
        crearCarta(tipos[Math.floor(Math.random() * tipos.length)], i * 200);
    }
}

function removeCard(card) {
    card.remove(); // Eliminar la carta del DOM
}

function removeAllCard() {
    const hand = document.getElementById('hand');
    hand.innerHTML = ''; // Eliminar todas las cartas
}