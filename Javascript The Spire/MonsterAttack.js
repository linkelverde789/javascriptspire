function startMonsterTurn() {
    if (!checkFreeze()) {
        alert('El monstruo no está congelado');

        let cartasEnemigo = [];
        const tipos = ['Daño', 'Curación', 'Defensa', 'Fuego'];

        for (let i = 0; i < 2; i++) {
            cartasEnemigo.push(crearCartaEnemigo(tipos[Math.floor(Math.random() * tipos.length)], i * 200));
        }

        // Espera a que el monstruo termine todas sus acciones antes de pasar al turno del jugador
        actionMonster(cartasEnemigo).then(() => {
            checkWinOrLoss();
            console.log("Turno del monstruo completado");
            // Ahora pasamos al turno del jugador
            turnoJugador();
        });

    } else {
        alert('El monstruo está congelado');
        // Si el monstruo está congelado, pasamos directamente al turno del jugador
        turnoJugador();
    }
}

function actionMonster(cartas) {
    const promises = cartas.map((carta, index) => {
        return new Promise((resolve) => {
            const delay = index === 0 ? 3000 : index * 2000;

            setTimeout(() => {
                let promise;
                // Obtenemos el tipo de carta y su valor desde el DOM
                const tipo = carta.querySelector('.card-header').textContent;
                const valor = parseInt(carta.querySelector('.card-value').textContent);

                console.log(`Monstruo usa carta de tipo: ${tipo} con valor: ${valor}`);
                switch (tipo) {
                    case 'Daño':
                        promise = monsterDamage(valor);
                        break;
                    case 'Defensa':
                        promise = monsterAddDefense(valor);
                        break;
                    case 'Curación':
                        promise = monsterHeal(valor);
                        break;
                    case 'Fuego':
                        promise = monsterFireAttack(valor);
                        break;
                    default:
                        console.error('Tipo de carta desconocido para el monstruo:', tipo);
                }

                // Removemos la carta del DOM después de la acción
                if (promise) {
                    promise.then(() => {
                        carta.remove();
                        resolve();  // Resolvemos la promesa cuando la acción se haya completado
                    });
                } else {
                    resolve();  // Si no hay promesa, resolvemos inmediatamente
                }
            }, delay);
        });
    });

    // Retornamos una promesa que se resuelve cuando todas las promesas del array se completen
    return Promise.all(promises);
}

function monsterFireAttack(valor) {
    return new Promise((resolve) => {
        monsterDamage(valor).then(() => {
            let heroBurnPointElement = document.getElementById('hero-burnPoint');
            let heroBurnPoint = parseInt(heroBurnPointElement.textContent);

            let random = Math.floor(Math.random() * 100);
            let posibilidad = Math.floor(Math.random() * 100);
            if (posibilidad < 41) {
                if (random < 34) {
                    heroBurnPoint += 1;
                } else if (random < 67) {
                    heroBurnPoint += 2;
                } else {
                    heroBurnPoint += 3;
                }
                heroBurnPointElement.textContent = heroBurnPoint;
            }
            if (heroBurnPoint > 0) {
                document.getElementById('hero-burn').style.display = 'block';
            } else {
                document.getElementById('hero-burn').style.display = 'none';
            }
            resolve();
        });
    });
}

function crearCartaEnemigo(tipo, delay) {
    const card = document.createElement('div');
    card.className = 'card';

    const cardHeader = document.createElement('div');
    cardHeader.className = 'card-header';
    cardHeader.textContent = tipo;

    let description;
    switch (tipo) {
        case 'Daño':
            description = 'Te golpea'; break;
        case 'Curación':
            description = 'Se cura puntos de vida'; break;
        case 'Defensa':
            description = 'Se defiende de tus golpes'; break;
        case 'Fuego':
            description = 'Te golpea con magia. Puede ser que te queme'; break;
        default:
            description = 'Acción desconocida';
    }

    const cardDescription = document.createElement('div');
    cardDescription.className = 'card-description';
    cardDescription.textContent = description;

    const cardValue = document.createElement('div');
    cardValue.className = 'card-value';
    cardValue.textContent = Math.floor(Math.random() * (10 - 5 + 1)); // Valor aleatorio entre 5 y 10

    card.appendChild(cardHeader);
    card.appendChild(cardDescription);
    card.appendChild(cardValue);

    const hand = document.getElementById('hand');
    hand.appendChild(card);

    setTimeout(() => {
        card.classList.add('visible');
    }, delay);

    return card;
}

function monsterDamage(valorCarta) {
    return new Promise((resolve) => {
        const heroHP = document.getElementById('hero-actualHP');
        let currentHP = parseInt(heroHP.textContent);
        let newHP = currentHP - heroFire(valorCarta);

        newHP = Math.max(newHP, 0); // Aseguramos que no sea menor que 0
        const healthBar = document.getElementById('hero-HP');
        healthBar.value = currentHP;

        const totalDuration = 250;
        const intervalDuration = 10;
        const difference = currentHP - newHP;
        const steps = totalDuration / intervalDuration;
        const decrement = difference / steps;

        let progressValue = currentHP;

        const interval = setInterval(() => {
            progressValue -= decrement;
            healthBar.value = Math.max(progressValue, newHP);
            heroHP.textContent = Math.max(Math.round(progressValue), 0);
            if (progressValue <= newHP) {
                progressValue = newHP;
                clearInterval(interval);
                resolve();
            }
        }, intervalDuration);
    });
}

function heroFire(valorCarta) {
    let quemadura = document.getElementById('hero-burnPoint');
    let result = valorCarta;
    if (parseInt(quemadura.textContent) > 0) {
        result = Math.floor(result * 1.3); // Aumenta el daño si está en llamas
    }
    return heroDefense(result);
}

function heroDefense(valorCarta) {
    let defensa = document.getElementById('hero-defensePoint');
    let result = parseInt(defensa.textContent) - valorCarta;
    if (result <= 0) {
        defensa.textContent = 0;
        document.getElementById('hero-defense').style.display = 'none';
        return Math.abs(result); // Devuelve el daño restante si la defensa no es suficiente
    } else {
        defensa.textContent = result;
        return 0; // No recibe daño, la defensa es suficiente
    }
}

function monsterAddDefense(valorCarta) {
    return new Promise((resolve) => {
        let defensePointText = document.getElementById('monster-defense');
        let defensePoint = document.getElementById('monster-defensePoint');
        defensePoint.textContent = parseInt(defensePoint.textContent) + valorCarta;
        defensePointText.style.display = 'block'; // Mostramos la defensa si es mayor a 0
        resolve();
    });
}

function monsterHeal(valorCarta) {
    return new Promise((resolve) => {
        const monsterHP = document.getElementById('monster-actualHP');
        let currentHP = parseInt(monsterHP.textContent);
        let newHP = currentHP + valorCarta;
        const healtBar = document.getElementById('monster-HP');
        if (newHP > healtBar.max) {
            newHP = healtBar.max; // No puede superar el máximo de HP
        }

        const totalDuration = 250;
        const intervalDuration = 10;
        const difference = newHP - currentHP;
        const steps = totalDuration / intervalDuration;
        const increment = difference / steps;

        let progressValue = currentHP;
        healtBar.value = progressValue;
        const interval = setInterval(() => {
            progressValue += increment;
            if (progressValue >= newHP) {
                progressValue = newHP;
                clearInterval(interval);
                resolve();
            }
            healtBar.value = progressValue;
            monsterHP.textContent = Math.round(progressValue);
        }, intervalDuration);
    });
}
function checkFreeze() {
    updateMonsterBurn();
    return updateMonsterFreeze() > 0;
}

function updateMonsterFreeze() {
    let freezePoint = document.getElementById('monster-freezePoint');
    let points = parseInt(freezePoint.textContent);
    if (points < 2) {
        document.getElementById('monster-freeze').style.display = 'none';
        freezePoint.textContent = 0;
    } else {
        document.getElementById('monster-freeze').style.display = 'block';
        freezePoint.textContent = points - 1;
    }
    return points;
}

function updateMonsterBurn() {
    let burnPoint = document.getElementById('monster-burnPoint');
    let points = parseInt(burnPoint.textContent);
    if (points < 2) {
        document.getElementById('monster-burn').style.display = 'none';
        burnPoint.textContent = 0;
    } else {
        document.getElementById('monster-burn').style.display = 'block';
        burnPoint.textContent = points - 1;
    }
}