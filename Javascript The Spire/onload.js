const enemies = [
    "0009.png",
    "bowser.png",
    "duck.png",
    "golem.png",
    "ivysaur.png",
    "krabby.png",
    "muk.png",
    "peep.png",
    "pidgeott.png",
    "pikachu.png",
    "sandslash.png"
];
const background = ['fondo.jpg', 'prueba1.jpg', 'prueba2.png', 'anhqv.jpg'];
function randomImg() {
    return 'enemigos/' + enemies[Math.floor(Math.random() * enemies.length)];
}
function randomBackground() {
    return 'fondos/' + background[Math.floor(Math.random() * background.length)];
}
window.onload = function () {

    //generar fondos y sprites aleatorios
    const imgElement = document.getElementById('monsterImage');
    imgElement.src = randomImg();
    const backgroundElement = document.getElementById('combat');
    backgroundElement.style.backgroundImage = 'url(' + randomBackground() + ')';


//asignar la vida del combate anterior
    let vida = sessionStorage.getItem('vidaActual');
    if (vida === null) {
        vida = 100;
    }else{
        vida=parseInt(vida);
    }

    document.getElementById('hero-actualHP').textContent = vida;
    document.getElementById('hero-HP').value = vida;
};