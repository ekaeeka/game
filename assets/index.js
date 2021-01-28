
let countOfElems = document.createElement('p');
let counterLbl = document.createElement('div');
let hrLine = document.createElement('hr');
let ultimateLbl = document.createElement('p');
let ultimateLblStatus = document.createElement('div');
let pauseLblStatus = document.createElement('div');
let timerLbl = document.createElement('div');
let skippedLbl = document.createElement('div');

let stop = false;

const game = document.querySelector('.game');
const startGameForm = document.querySelectorAll('.startgame')[0];
let counterLabel;

let nickname;
let basket;
let visibleObjects = [];

const speed = 75;
let count = 0;
let catched = 0;
let startDelay = 100;
let generatingDelay = 1000;
let ult_cool_down = false;
let ult_pressed = 0;
let skipped = 0;
let countLife=3;

let sec_Tmp = 0;

function startGame() {
    setInterval(function () {
        if (!stop) {
            sec_Tmp++;
            timer(sec_Tmp);
            // Завершение игры через 10 секунд
            let winGame = setTimeout(function () {
                if (!stop) {
                    clearInterval(winGame);
                    stop = true;
                    // Аннулирование результатов
                    startGameForm.hidden = true;
                    game.hidden = true;
                    const losingForm = document.querySelector('.losing');
                    losingForm.innerHTML = nickname + ", ваш результат: <br>"
                    losingForm.innerHTML = losingForm.innerHTML + "Всего было произведено: " + count + " элементов <br>";
                    losingForm.innerHTML = losingForm.innerHTML + "Поймано: " + catched;
                    countOfElems.hidden = true;
                    counterLbl.hidden = true;
                    hrLine.hidden = true;
                    ultimateLbl.hidden = true;
                    ultimateLblStatus.hidden = true;
                    pauseLblStatus.hidden = true;
                    alert("Игра выиграна");
                    return;
                }
            }, 100000);

            let fruitObject = document.createElement("img");
            fruitObject.setAttribute('src', 'img/fruit.png');
            fruitObject.setAttribute('height', '70px');
            fruitObject.setAttribute('width', '50px');
            fruitObject.setAttribute('style', 'position: absolute; top: 0px;');
            fruitObject.setAttribute('id', count.toString());
            let randomLeft = getRandomArbitrary(game.getBoundingClientRect()['left'], game.getBoundingClientRect()['left'] + 750);
            fruitObject.style.left = randomLeft + "px";
            fruitObject.style.top = "5px";
            game.insertAdjacentElement('beforeend', fruitObject);

            visibleObjects.push([fruitObject, setTimeout(function () {
                const moving = setInterval(function () {
                    if (!stop) {
                        //Проверка на пропуски
                        if (countLife === 0) {
                            stop = true;
                            alert("Игра проиграна");
                            alert(countLife);
                            visibleObjects.forEach(value => {
                                if (value != null) {
                                    game.removeChild(value[0]);
                                }
                            });
                            // Аннулирование результатов
                            startGameForm.hidden = true;
                            game.hidden = true;
                            const losingForm = document.querySelector('.losing');
                            losingForm.innerHTML = nickname + ", ваш результат: <br>"
                            losingForm.innerHTML = losingForm.innerHTML + "Всего было произведено: " + count + " элементов <br>";
                            losingForm.innerHTML = losingForm.innerHTML + "Поймано: " + catched;
                            countOfElems.hidden = true;
                            counterLbl.hidden = true;
                            hrLine.hidden = true;
                            ultimateLbl.hidden = true;
                            ultimateLblStatus.hidden = true;
                            pauseLblStatus.hidden = true;
                            return;
                        }

                        let topCount = parseInt(fruitObject.style.top.substring(0, fruitObject.style.top.length - 2));

                        /* Проверка на координаты */
                        if (Math.abs(basket.getBoundingClientRect()['y'] - fruitObject.getBoundingClientRect()["y"]) < 25) {
                            if (Math.abs(basket.getBoundingClientRect()['x'] - fruitObject.getBoundingClientRect()["x"]) < 50) {
                                catched++;
                                game.removeChild(fruitObject);
                                visibleObjects[parseInt(fruitObject.getAttribute("id"))] = null;
                                clearInterval(moving);
                                counterLabel.innerText = catched.toString();
                            }
                        }


                        // Удаление объекта об пол
                        if (topCount > game.getBoundingClientRect()['bottom'] - 80) {
                            countLife--;
                            skippedLbl.innerHTML = "Осталось жизней: " + countLife;
                            skipped++;
                            game.removeChild(fruitObject);
                            visibleObjects[parseInt(fruitObject.getAttribute("id"))] = null;
                            clearInterval(moving);
                        }

                        if (ult_pressed) {
                            fruitObject.style.left = basket.style.left;
                        }
                        //Движение
                        topCount = topCount + getRandomArbitrary(1, 5);
                        fruitObject.style.top = topCount.toString() + "px";
                    }
                }, getRandomArbitrary(1, 50))
            }, startDelay)]);
            count++;
        }
    }, generatingDelay);

}

function execute() {
    /*  Спавн корзины */
    basket.setAttribute('src', 'img/basket.png');
    basket.setAttribute('style', "position: absolute; top: 0px; left:" + game.getBoundingClientRect()['left'] + "px;right:0px;");
    basket.setAttribute('height', '100px');
    basket.setAttribute('width', '75px');

    basket.style.top = "509px";

    game.insertAdjacentElement('beforeend', basket);

    // Движение ведра
    function moveLeft() {
        if (!stop || !ult_pressed) {
            let incLeft = parseInt(basket.style.left.substring(0, basket.style.left.length - 2));

            if (incLeft - speed > game.getBoundingClientRect()['left'])
                basket.style.left = incLeft - speed + "px";
            else
                basket.style.left = game.getBoundingClientRect()['left'] + "px";
        }
    }

    function moveRight() {
        if (!stop || !ult_pressed) {
            let incRight = parseInt(basket.style.left.substring(0, basket.style.left.length - 2));
            if (incRight + speed < game.getBoundingClientRect()['left'] + 725)
                basket.style.left = incRight + speed + "px";
            else
                basket.style.left = game.getBoundingClientRect()['left'] + 725 + "px";
        }
    }

    function setUltTimeout() {
        if (ult_pressed) {
            setTimeout(function () {
                ult_cool_down = true;
                ult_pressed = false;
                document.querySelector('.ult').innerHTML = "Восстановление";
            }, 4000);
        }
    }

    // Нажатие кнопки ульты
    document.addEventListener('keydown', ev => {
        if (ev.key === " " && !ult_pressed && !ult_cool_down) {
            document.querySelector('.ult').innerHTML = "Нажата";
            ult_pressed = true;
            setUltTimeout();
        }
    });

    // Событие когда отжимаешь кнопку ульты
    document.addEventListener('keyup', ev => {
        if (ev.key === " " || ult_cool_down || ult_pressed) {

            ult_pressed = false;
            ult_cool_down = true;
            document.querySelector('.ult').innerHTML = "Восстановление";
            setTimeout(function () {
                ult_cool_down = false;
                document.querySelector('.ult').innerHTML = "Готова";
            }, 5000);
        }
        if (ev.key === " " && !ult_cool_down) {
            document.querySelector('.ult').innerHTML = "Восстановление";
        }
    });

    document.addEventListener("keydown", ev => {
        switch (ev.key) {
            case "a":
                moveLeft();
                break;
            case "ArrowLeft":
                moveLeft();
                break;
            case "A":
                moveLeft();
                break;
            case "d" :
                moveRight();
                break;
            case "D":
                moveRight();
                break;
            case "ArrowRight":
                moveRight();
                break;
            case "В":
                moveRight();
                break;
            case "в":
                moveRight();
                break;
            case "ф":
                moveLeft();
                break;
            case "Ф":
                moveLeft();
                break;
            case "Escape":
                stop ^= true;
                document.querySelectorAll(".pause")[0].hidden ^= true;
                break;
        }
    });
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function hideForm() {
    nickname = document.querySelector('.startgame>input').value;
    if (nickname !== "") {
        document.cookie = "nick=" + nickname;
        startGameForm.hidden = true;
        game.hidden = false;
        basket = document.createElement("img");
        execute();
        startGame();
        stop = false;

        timerLbl.innerHTML = "00:00";
        countOfElems.innerText = "Объектов поймано:"

        counterLbl.innerText = "0";
        counterLbl.className = "counter"
        counterLabel = counterLbl;
        hrLine.style = "width: 20px;";

        ultimateLbl.innerText = "Ульта:";

        ultimateLblStatus.innerText = "Готова";
        ultimateLblStatus.className = "ult"

        pauseLblStatus.innerText = "ПАУЗА";
        pauseLblStatus.className = "pause"
        pauseLblStatus.hidden = true;
        pauseLblStatus.style = "text-align:center; position: absolute; left: 50%; top: 25%;";

        skippedLbl.innerHTML = "Осталось жизней: " + countLife;

        document.body.insertAdjacentHTML('beforeend', "Ваш никнейм: " + nickname + "<br>");
        document.body.insertAdjacentElement('beforeend', countOfElems);
        document.body.insertAdjacentElement('beforeend', counterLbl);
        document.body.insertAdjacentElement('beforeend', hrLine);
        document.body.insertAdjacentElement('beforeend', ultimateLblStatus);
        document.body.insertAdjacentElement('beforeend', pauseLblStatus);
        document.body.insertAdjacentElement('beforeend', timerLbl);
        document.body.insertAdjacentElement('beforeend', skippedLbl);
    }
}

function timer(sec) {
    if (sec < 10) {
        timerLbl.innerHTML = "00:0" + sec;
    }
    if ((sec > 10) && (sec < 60)) {
        timerLbl.innerHTML = "0:" + sec;
    }
    if (sec > 60) {
        if (Math.round(sec % 60) < 10) {
            timerLbl.innerHTML = "0" + (Math.round(sec % 60)).toString() + ":" +
                sec - Math.round(sec % 60);
        }
    }
}

document.querySelector('.startgame>input').value = document.cookie.substring(5)