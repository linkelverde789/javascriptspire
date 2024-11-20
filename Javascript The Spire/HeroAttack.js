function damage(valorCarta) {
    return new Promise((resolve) => {
        const monsterHP = document.getElementById('monster-actualHP');
        let currentHP = parseInt(monsterHP.textContent);
        let newHP = currentHP - monsterFire(valorCarta);

        newHP = Math.max(newHP, 0);
        const healthBar = document.getElementById('monster-HP');
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
            monsterHP.textContent = Math.max(Math.round(progressValue), 0);
            if (progressValue <= newHP) {
                progressValue = newHP;
                clearInterval(interval);
                resolve();
            }
        }, intervalDuration);
    });
}

function heal(valorCarta) {
    return new Promise((resolve) => {
        const heroHP = document.getElementById('hero-actualHP');
        let currentHP = parseInt(heroHP.textContent);
        let newHP = currentHP + valorCarta;
        const healtBar = document.getElementById('hero-HP');
        if (newHP > healtBar.max) {
            newHP = healtBar.max;
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
            heroHP.textContent = Math.round(progressValue);
        }, intervalDuration);
    });
}

function defense(valorCarta) {
    return new Promise((resolve) => {
        let defensePointText = document.getElementById('hero-defense');
        let defensePoint = document.getElementById('hero-defensePoint');
        defensePoint.textContent = parseInt(defensePoint.textContent) + valorCarta;
        defensePointText.style.display = 'block';
        resolve();
    });
}

function fireAttack(valorCarta) {
    return new Promise((resolve) => {
        damage(valorCarta).then(() => {
            let monsterBurnPointElement = document.getElementById('monster-burnPoint');
            let monsterBurnPoint = parseInt(monsterBurnPointElement.textContent);

            let random = Math.floor(Math.random() * 100);
            let posibilidad = Math.floor(Math.random() * 100);
            if (posibilidad < 41) {
                if (random < 34) {
                    monsterBurnPoint += 1;
                } else if (random < 67) {
                    monsterBurnPoint += 2;
                } else {
                    monsterBurnPoint += 3;
                }
                monsterBurnPointElement.textContent = monsterBurnPoint;
            }
            if(monsterBurnPoint>0){
                document.getElementById('monster-burn').style.display='block';
            }else{
                document.getElementById('monster-burn').style.display='none';
            }
            resolve();
        });
    });
}

function iceAttack(valorCarta) {
    return new Promise((resolve) => {
        damage(valorCarta).then(() => {
            let monsterFreezePointElement = document.getElementById('monster-freezePoint');
            let monsterFreezePoint = parseInt(monsterFreezePointElement.textContent);

            let random = Math.floor(Math.random() * 100);
            let posibilidad = Math.floor(Math.random() * 100);
            if (posibilidad < 41) {
                if (random < 51) {
                    monsterFreezePoint += 1;
                }
                else {
                    monsterFreezePoint += 2;
                }
                monsterFreezePointElement.textContent = monsterFreezePoint;
            }

            if(monsterFreezePoint>0){
                document.getElementById('monster-freeze').style.display='block';
            }else{
                document.getElementById('monster-freeze').style.display='none';
            }

            resolve();
        });
    });
}




// Elementos del enemigo

function monsterDefense(valorCarta) {
    let defensa = document.getElementById('monster-defensePoint');
    let result = parseInt(defensa.textContent) - valorCarta;
    if (result <= 0) {
        defensa.textContent = 0;
        document.getElementById('monster-defense').style.display = 'none';
        return Math.abs(result);
    } else {
        defensa.textContent = result;
        return 0;
    }

}

function monsterFire(valorCarta) {
    let quemadura = document.getElementById('monster-burnPoint');
    let result = valorCarta;
    if (parseInt(quemadura.textContent) > 0) {
        result = Math.ceil(result * 1.3);
    }
    return monsterDefense(result);
}