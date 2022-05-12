const container = document.querySelector('.game');
const main = document.querySelector('.main');
const gameBoard = maker(container, 'div', 'gameBoard', 'Get 10 bubbles of the color in the image');
const mainBoard = maker(main, 'div', 'mainBoard', '');
var goals = {}
var c1 = 0
var errores = 0

var idx = ran(0, 5)
var img = new Image()
img.setAttribute('id', 'img')
mainBoard.append(img)
img.style.height = '200px'
img.style.margin = '220px 275px'

const items = ['Blue1.jpg', 'Pink1.jpg',
    'Pink2.jpg', 'Purple1.jpg',
    'Red1.jpg', 'Red2.jpg'];

const basicColors = [
    '#DCDCDC', '#A9A9A9',
    '#696969', '#708090'
]

const route = './assets/js/Images/'
const game = { ani: {}, total: 0, counter: 0, ready: 0, bad: 0 };
const btn = maker(container, 'button', 'btn', 'Click to Start');
btn.addEventListener('click', startGame)

var color = []

const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => {
    const hex = x.toString(16)
    return hex.length === 1 ? '0' + hex : hex
}).join('')

const color1 = document.createElement('div')
color1.setAttribute('class', 'colors')
color1.setAttribute('id', 'color1')
mainBoard.append(color1)

function LoadImage() {
    img = document.getElementById('img')
    idx = ran(0, 5)
    img.src = route + items[idx]
    game.total = 10
    game.bad = 10
    game.ready = 0

    img.addEventListener('load', function () {
        var colorThief = new ColorThief();
        color = colorThief.getPalette(document.getElementById('img'), 3);
        color = color.map(item => rgbToHex(item[0], item[1], item[2])) // Colores a Hexadecimales
    })
}

score1 = document.getElementById('score1')
score1.style.display = 'none'

function startGame() {
    btn.style.display = 'none';
    gameBoard.innerHTML = "";
    game.ani = requestAnimationFrame(mover)
    LoadImage()

    ind = document.getElementById('help')
    ind.style.display = 'block'
    err = document.getElementById('errores')
    err.style.display = 'block'
    score1.style.display = 'block'
    
    retry = document.getElementById('retry')
    retry.style.display = 'block'
    retry.addEventListener('click', LoadImage)
}

function badBubbles() {
    const bubble = maker(container, 'div', 'baddy', '');
    const cSize = gameBoard.getBoundingClientRect();
    
    gameBoard.append(bubble);
    bubble.speed = ran(0.5, 2);
    bubble.style.backgroundColor = color[Math.floor(Math.random() * color.length)]; //Colores Random Para los que SON
    
    var color2 = document.getElementById('color1')
    color2.style.background = color[0]
    bubble.style.transform = `scale(${ran(1, 3)})`;
    bubble.style.left = ran(0, (cSize.width - 30)) + 'px';
    bubble.style.top = ran(0, 500) + 500 + 'px';
    
    bubble.addEventListener('click', (e) => {
        if (bubble.style.backgroundColor === color2.style.background) {
            score1.textContent = ++c1;
            goals[bubble.style.backgroundColor] = c1
        }
        else{
            errores++
            err.textContent = 'Errores (máximo 3): ' + errores
        }
        bubble.remove()
        game.bad = 10
    })
}

function genBubbles() {
    items.sort(() => Math.random() - .5);
    const bubble = maker(container, 'div', 'bubble', '');
    const cSize = gameBoard.getBoundingClientRect();
    gameBoard.append(bubble);
    bubble.speed = ran(1, 2);
    bubble.dir = ran(0, 10) - 5;
    bubble.style.backgroundColor = basicColors[Math.floor(Math.random() * basicColors.length)]; //Colores Random Para los que SON
    bubble.style.transform = `scale(${ran(1, 3)})`;
    bubble.style.left = ran(0, (cSize.width - 30)) + 'px';
    bubble.style.top = ran(0, 500) + 500 + 'px';
    
    bubble.addEventListener('click', (e) => {
        bubble.remove();
        errores++
        err.textContent = 'Errores (máximo 3): ' + errores
    })
}

function mover() {
    if (game.bad > 0) {
        badBubbles()
        game.bad--
    }
    if (game.ready < game.total) {
        game.ready++
        genBubbles()
    }
    const allBaddy = document.querySelectorAll('.baddy');
    allBaddy.forEach((bubble) => {
        const pos = [bubble.offsetLeft, bubble.offsetTop];
        const speed = bubble.speed
        pos[1] -= speed
        if (pos[1] < -100) {
            bubble.remove()
            badBubbles()
        }
        bubble.style.top = pos[1] + 'px'
        bubble.style.left = pos[0] + 'px'
    })

    const allBubbles = document.querySelectorAll('.bubble');
    allBubbles.forEach((bubble) => {
        const pos = [bubble.offsetLeft, bubble.offsetTop];
        const speed = bubble.speed
        pos[1] -= speed
        if (pos[1] < -100) {
            bubble.remove()
            genBubbles()
        }
        bubble.style.top = pos[1] + 'px';
        bubble.style.left = pos[0] + 'px';
    })
    game.ani = requestAnimationFrame(mover);

    if (c1 >= 3){
        cancelAnimationFrame(game.ani);
        alert("CORRECTO")
        location.reload()
    } 

    if( errores === 3 ){
        cancelAnimationFrame(game.ani);
        alert("INCORRECTO")
        location.reload()
    }

}

function ran(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function maker(parent, eleType, myClass) {
    const elem = document.createElement(eleType);
    if (myClass === 'btn'){
        elem.textContent = 'No soy un robot';
    }
    elem.classList.add(myClass);
    parent.append(elem);
    return elem;
}

