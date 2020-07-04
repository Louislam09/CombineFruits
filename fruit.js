const grid = document.querySelector('.game__grid');
const missionContainer = document.querySelector('.mission__container');
const moveContainer = document.querySelector('.game__move > span');
const missionCompletedContainer = document.querySelector('.mission__completed');
const missionFailedContainer = document.querySelector('.mission__failed');
const homeContainer = document.querySelector('.home__container');
const homeLife = document.querySelector('.life__number');
const homeCountdown = document.querySelector('.countdown__container');

const missions = document.querySelectorAll('.mission');
const missionWinLevel = document.querySelector('.mission__completed .mission__score .level');
const missionFailLevel = document.querySelector('.mission__failed .mission__score .level');
const missionWinLife = document.querySelector('.mission__completed .mission__score .score');
const missionFailLife = document.querySelector('.mission__failed .mission__score .score');

const homePlayButton = document.querySelector('.home__play__button');
const nextLevelButton = document.querySelector('.mission__next__button');
const goHomeButton = document.querySelector(' .mission__home__button');
const goHomeButton1 = document.querySelector('.mission__home__button1');
const playAgainButton = document.querySelector(' .mission__play-again__button');

const width = 6;
let moveCounter,
	level = 1,
	cookieLevel = "myLevel",
	goal1,
	goal2,
	goal3;
let lifes = 5,
	MinuteForNewLife = 10,
	cookieLife = 'myLife';

let missionOneNumber = missions[0].children[1];
let missionTwoNumber = missions[1].children[1];
let missionThreeNumber = missions[2].children[1];

let missionOneFruit = missions[0].children[0];
let missionTwoFruit = missions[1].children[0];
let missionThreeFruit = missions[2].children[0];

// SOUNDS
const backgroundSound = new Audio();
const matchSound = new Audio();
const popSound = new Audio();
const gameoverSound = new Audio();
const completedSound = new Audio();
const magnificSound = new Audio();
const ohlalaSound = new Audio();
const notLifeSound = new Audio();
let canMatch = true;
// SOUNDS SRC
backgroundSound.src = './sound/background_sound.mp3';
matchSound.src = './sound/match_sound.mp3';
popSound.src = './sound/pop_sound.mp3';
gameoverSound.src = './sound/gameover.ogg';
completedSound.src = './sound/completed.mp3';
magnificSound.src = './sound/oh_magnific.mp3';
ohlalaSound.src = './sound/ohlala.mp3';
notLifeSound.src = './sound/not_life.mp3';

let fruits = [];
let firstFruitTarget, secondFruitTarget;

const randomColorWithFruit = [
	['#fdf6f64f', '🍎'],
	['#fdf6f64f', '🍇'],
	['#fdf6f64f', '🍉'],
	['#fdf6f64f', '🍍'],
	['#fdf6f64f', '🍐']
];
class Fruit {
	constructor(className) {
		this.colorFruit = randomColorWithFruit[Math.floor(Math.random() * randomColorWithFruit.length)];
		this.fruitInnerText = this.colorFruit[1];
		this.div = document.createElement('div');
		this.div.setAttribute('draggable', 'true');
		this.div.setAttribute('class', className);
		this.div.innerText = this.fruitInnerText;
		this.div.style.background = this.colorFruit[0];
		this.fruitEvent();
	}

	fruitEvent() {
		this.div.addEventListener('dragstart', (e) => {
			firstFruitTarget = e.target;
			firstFruitTarget.classList.add('rotate');
			e.dataTransfer.effectAllowed = 'move';
		});
		this.div.addEventListener('dragenter', (e) => {
			// e.preventDefault();
		});
		this.div.addEventListener('dragover', (e) => {
			e.preventDefault();
			e.dataTransfer.effectAllowed = 'move';
			return false;
		});
		this.div.addEventListener('dragleave', (e) => {
			e.preventDefault();
		});
		this.div.addEventListener('dragend', (e) => {
			firstFruitTarget.classList.remove('rotate');
		});
		this.div.addEventListener('drop', (e) => {
			secondFruitTarget = e.target;
			firstFruitTarget.classList.remove('rotate');

			swapFruit(firstFruitTarget, secondFruitTarget);
		});
		if (isMobile()) {
			this.div.addEventListener('touchstart', touchStart);
			this.div.addEventListener('touchend', touchEnd);
		}
	}
}

window.addEventListener('load', () => {
	registerSW();
	getLifeAndLevelFromCookie();
	startCountdown();
	showHomeScreen();
	buttonEvents();
});

function buttonEvents() {
	homePlayButton.addEventListener('click', gameStart);
	goHomeButton.addEventListener('click', showHomeScreen);
	goHomeButton1.addEventListener('click', showHomeScreen);

	nextLevelButton.addEventListener('click', nextLevel);
	playAgainButton.addEventListener('click', playAgainLevel);
}
function gameStart() {
	hideSection(missionCompletedContainer);
	hideSection(missionFailedContainer);
	hideSection(homeContainer);
	showSection(missionContainer);
	showSection(grid);
	createBoard(false);
}
function nextLevel() {
	hideSection(missionCompletedContainer);
	showSection(grid);
	createBoard(true);
}
function playAgainLevel() {
	stopSound(gameoverSound);
	hideSection(missionFailedContainer);
	showSection(grid);
	createBoard(false);
}
function getRandomColor() {
	let r = Math.floor(Math.random() * 255);
	let g = Math.floor(Math.random() * 255);
	let b = Math.floor(Math.random() * 255);

	return `rgb(${r},${g},${b})`;
}
function createBoard(levelCompleted = true) {
	if (lifes !== 0) {
		grid.innerHTML = '';
		fruits = [];

		for (let i = 0; i < width * width; i++) {
			let fruit = new Fruit(i);
			fruits.push(fruit.div);
			grid.appendChild(fruit.div);
		}

		setNewLevel(levelCompleted);
		setMissionNumber();
		setMissionFruit();

		playSound(backgroundSound, true);

		startLoop();
	} else {
		notLifeMessage();
	}
}

function random(min, max) {
	var rand;
	rand = Math.random();

	if (min > max) {
		var tmp = min;
		min = max;
		max = tmp;
	}

	return Math.floor(rand * (max - min) + min);
}
function setLevelStyle() {
	let lastIndex = level.toString();
	lastIndex = parseInt(lastIndex[lastIndex.length - 1]);

	if (level === 2 || lastIndex === 2) {
		document.documentElement.style.setProperty(" --border-color", "#00d4adf5");
		document.documentElement.style.setProperty("--shadow-color", "#00bcd4");
		document.documentElement.style.setProperty("--bg-color", "repeating-linear-gradient(45deg, #1415154f, #00bcd4 50%)");
		document.documentElement.style.setProperty("--move-color", "#00bcd4");
	}
	if (level === 3 || lastIndex === 3) {
		document.documentElement.style.setProperty(" --border-color", "#ffeb3b");
		document.documentElement.style.setProperty("--shadow-color", "#FFEB3B");
		document.documentElement.style.setProperty("--bg-color", "repeating-linear-gradient(#1415154f, #35e653 )");
		document.documentElement.style.setProperty("--move-color", "#FF9800");
	}
	if (level === 4 || lastIndex === 4) {
		document.documentElement.style.setProperty(" --border-color", "#4a07c1");
		document.documentElement.style.setProperty("--shadow-color", " #E91E63");
		document.documentElement.style.setProperty("--bg-color", "repeating-linear-gradient(#1415154f,#9c27b0 )");
		document.documentElement.style.setProperty("--move-color", "#673ab7a6");
	}
	if (level === 5 || lastIndex === 5) {
		document.documentElement.style.setProperty(" --border-color", "#00d4adf5");
		document.documentElement.style.setProperty("--shadow-color", "#00bcd4");
		document.documentElement.style.setProperty("--bg-color", "repeating-linear-gradient( #1415154f, #FF5722)");
		document.documentElement.style.setProperty("--move-color", "#00bcd4");
	}
	if (level === 6 || lastIndex === 6) {
		document.documentElement.style.setProperty(" --border-color", "#ffeb3b");
		document.documentElement.style.setProperty("--shadow-color", "#00BCD4");
		document.documentElement.style.setProperty("--bg-color", "repeating-linear-gradient(190deg,#009688 ,#e91e63 100%)");
		document.documentElement.style.setProperty("--move-color", "#009688");
	}
	if (level === 7 || lastIndex === 7) {
		document.documentElement.style.setProperty(" --border-color", "#3bff65");
		document.documentElement.style.setProperty("--shadow-color", "#d6e64c");
		document.documentElement.style.setProperty("--bg-color", "repeating-linear-gradient(-45deg,#2196F3 ,#E91E63 100%)");
		document.documentElement.style.setProperty("--move-color", "#8bc34aad");
	}
	if (level === 8 || lastIndex === 8) {
		document.documentElement.style.setProperty(" --border-color", "#FFEB3B");
		document.documentElement.style.setProperty("--shadow-color", "#FF5722");
		document.documentElement.style.setProperty("--bg-color", "repeating-linear-gradient(-45deg,#2196F3 ,#795548 100%)");
		document.documentElement.style.setProperty("--move-color", "#8bc34aad");
	}
	if (level === 9 || lastIndex === 9) {
		document.documentElement.style.setProperty(" --border-color", "#9be0ff");
		document.documentElement.style.setProperty("--shadow-color", "#8BC34A");
		document.documentElement.style.setProperty("--bg-color", "repeating-linear-gradient(-45deg,#009688 ,#F44336 100%)");
		document.documentElement.style.setProperty("--move-color", "#f443367d");
	}
	if (level === 10 || lastIndex === 0) {
		document.documentElement.style.setProperty(" --border-color", "#07bafffc");
		document.documentElement.style.setProperty("--shadow-color", "#00BCD4");
		document.documentElement.style.setProperty("--bg-color", "repeating-linear-gradient(25deg,#009688 ,#9E9E9E 50%)");
		document.documentElement.style.setProperty("--move-color", "#4CAF50");
	}
}

function setNewLevel(newLevel = false) {
	stopSound(completedSound);
	if (newLevel) level++;

	if (level === 1) (moveCounter = 30), (goal1 = 20), (goal2 = 20), (goal3 = 20);
	if (level === 2) (moveCounter = 40), (goal1 = 35), (goal2 = 35), (goal3 = 35);
	if (level === 3) (moveCounter = 55), (goal1 = 60), (goal2 = 60), (goal3 = 60);
	if (level === 4) (moveCounter = 60), (goal1 = 60), (goal2 = 40), (goal3 = 80);
	if (level === 5) (moveCounter = 80), (goal1 = 100), (goal2 = 80), (goal3 = 60);
	if (level === 6) (moveCounter = 80), (goal1 = 0), (goal2 = 150), (goal3 = 0);
	if (level === 7) (moveCounter = 80), (goal1 = 40), (goal2 = 120), (goal3 = 40);
	if (level === 8) (moveCounter = 35), (goal1 = 40), (goal2 = 0), (goal3 = 40);
	if (level === 9) (moveCounter = 35), (goal1 = 50), (goal2 = 0), (goal3 = 40);
	if (level === 10) (moveCounter = 20), (goal1 = 20), (goal2 = 20), (goal3 = 20);
	if (level > 10) (moveCounter = random(35, 50)), (goal1 = random(10, 60)), (goal2 = random(35, 50)), (goal3 = random(20, 75));

	setLevelStyle()
}
function setMissionFruit() {
	let randomNumber1 = Math.floor(Math.random() * 5);
	let randomNumber2 = randomNumber1 + 1;
	let randomNumber3 = randomNumber1 + 2;

	if (randomNumber1 === 3) {
		randomNumber2 = 4;
		randomNumber3 = 0;
	}
	if (randomNumber1 === 4) {
		randomNumber2 = 0;
		randomNumber3 = 1;
	}

	missionOneFruit.innerText = randomColorWithFruit[randomNumber1][1];
	missionTwoFruit.innerText = randomColorWithFruit[randomNumber2][1];
	missionThreeFruit.innerText = randomColorWithFruit[randomNumber3][1];

	if (missionOneFruit.innerText === missionTwoFruit.innerText) {
		missionTwoFruit.innerText = randomColorWithFruit[Math.floor(Math.random() * randomColorWithFruit.length)][1];
	}
	if (missionOneFruit.innerText === missionThreeFruit.innerText) {
		missionThreeFruit.innerText = randomColorWithFruit[Math.floor(Math.random() * randomColorWithFruit.length)][1];
	}
	if (missionTwoFruit.innerText === missionThreeFruit.innerText) {
		missionThreeFruit.innerText = randomColorWithFruit[Math.floor(Math.random() * randomColorWithFruit.length)][1];
	}
}
function setMissionNumber() {
	moveContainer.innerText = moveCounter;
	missionOneNumber.innerText = goal1;
	missionTwoNumber.innerText = goal2;
	missionThreeNumber.innerText = goal3;
}
function updateMoveContainer() {
	moveCounter--;
	setMissionNumber();
}
function updateMissionNumber(matchedFruit, number) {
	if (matchedFruit === missionOneFruit.innerText && goal1 > 0) {
		goal1 = goal1 - number;
		if (goal1 < 0) goal1 = 0;
	}
	if (matchedFruit === missionTwoFruit.innerText && goal2 > 0) {
		goal2 = goal2 - number;
		if (goal2 < 0) goal2 = 0;
	}
	if (matchedFruit === missionThreeFruit.innerText && goal3 > 0) {
		goal3 = goal3 - number;
		if (goal3 < 0) goal3 = 0;
	}

	setMissionNumber();
}
function isMissionCompleted() {
	if (goal1 === 0 && goal2 === 0 && goal3 === 0) {
		return true;
	}
}
function checkForWin() {
	if (isMissionCompleted()) {
		stopLoop();
		fruits.forEach((fruit) => fruit.classList.add('rotate'));

		setTimeout(() => {
			fruits.forEach((fruit) => fruit.classList.remove('rotate'));
			playSound(backgroundSound, true, 0.5);
			playSound(completedSound, false);
			showWinScreen();
		}, 2000);
	}
}
function checkForLose() {
	if (moveCounter === 0) {
		stopLoop();
		fruits.forEach((fruit) => fruit.classList.add('rotate'));
		fruits.forEach((fruit) => (fruit.style.borderColor = 'red'));

		setTimeout(() => {
			fruits.forEach((fruit) => fruit.classList.remove('rotate'));
			stopSound(backgroundSound);
			playSound(gameoverSound, true);
			showFailScreen();
		}, 2000);
	}
}
function playSound(sound, loop, volume = 1) {
	sound.currentTime = 0;
	if (sound == matchSound) sound.currentTime = 1;
	sound.loop = loop;
	sound.volume = volume;
	sound.play();

	startBackgroundSound = false;
}
function stopSound(sound) {
	sound.pause();
}
function getCloseFruits(fruit) {
	return [
		parseInt(fruit.className) + width,
		parseInt(fruit.className) - 1,
		parseInt(fruit.className) - width,
		parseInt(fruit.className) + 1
	];
}
function moveFruitDown() {
	for (let i = 0; i < 30; i++) {
		if (fruits[i].innerText === '') {
			let colorFruit = randomColorWithFruit[Math.floor(Math.random() * randomColorWithFruit.length)];
			fruits[i].innerText = colorFruit[1];
			fruits[i].style.background = colorFruit[0];
		}

		if (fruits[i + width].innerText === '') {
			fruits[i + width].innerText = fruits[i].innerText;
			fruits[i].innerText = '';

			const firstRow = [0, 1, 2, 3, 4, 5];
			const isFirstRow = firstRow.includes(i);
		}
	}
}
function checkRowForThree() {
	if (canMatch) {
		for (let i = 0; i < 34; i++) {
			let rowOfThree = [i, i + 1, i + 2];
			const isBlank = fruits[i].innerText === '';
			const decidedFruit = fruits[i].innerText;
			const notValid = [4, 5, 10, 11, 16, 17, 22, 23, 28, 29];

			if (notValid.includes(i)) continue;

			if (rowOfThree.every((index) => fruits[index].innerText === decidedFruit && !isBlank)) {
				rowOfThree.forEach((index) => fruits[index].classList.add('combined-fruits'));

				if (fruits[i].classList.contains('combined-fruits')) playSound(matchSound, false, 0.2);
				setTimeout(() => rowOfThree.forEach((index) => fruits[index].classList.remove('combined-fruits')), 300);
				setTimeout(() => rowOfThree.forEach((index) => (fruits[index].innerText = '')), 300);
				setTimeout(() => updateMissionNumber(decidedFruit, 3), 300);
				checkForWin();
			}
		}
	}
}
function checkColumnForThree() {
	if (canMatch) {
		for (let i = 0; i < 24; i++) {
			let columnOfThree = [i, i + width, i + width * 2];
			const isBlank = fruits[i].innerText === '';
			const decidedFruit = fruits[i].innerText;

			if (columnOfThree.every((index) => fruits[index].innerText === decidedFruit && !isBlank)) {
				columnOfThree.forEach((index) => fruits[index].classList.add('combined-fruits'));
				if (fruits[i].classList.contains('combined-fruits')) playSound(matchSound, false, 0.2);
				setTimeout(
					() => columnOfThree.forEach((index) => fruits[index].classList.remove('combined-fruits')),
					300
				);
				setTimeout(() => columnOfThree.forEach((index) => (fruits[index].innerText = '')), 300);
				setTimeout(() => updateMissionNumber(decidedFruit, 3), 300);
			}
		}
	}
}
function checkRowForFour() {
	if (canMatch) {
		for (let i = 0; i < 33; i++) {
			let rowOfFour = [i, i + 1, i + 2, i + 3];
			const isBlank = fruits[i].innerText === '';
			const decidedFruit = fruits[i].innerText;

			const notValid = [3, 4, 5, 9, 10, 11, 15, 16, 17, 21, 22, 23, 27, 28, 29];

			if (notValid.includes(i)) continue;

			if (rowOfFour.every((index) => fruits[index].innerText === decidedFruit && !isBlank)) {
				rowOfFour.forEach((index) => fruits[index].classList.add('combined-fruits'));

				if (fruits[i].classList.contains('combined-fruits')) playSound(ohlalaSound, false);
				if (fruits[i].classList.contains('combined-fruits')) playSound(matchSound, false, 0.2);
				setTimeout(() => rowOfFour.forEach((index) => fruits[index].classList.remove('combined-fruits')), 300);
				setTimeout(() => rowOfFour.forEach((index) => (fruits[index].innerText = '')), 300);
				setTimeout(() => updateMissionNumber(decidedFruit, 4), 300);
				canMatch = false;
			}
		}
	}
}
function checkColumnForFour() {
	if (canMatch) {
		for (let i = 0; i < 18; i++) {
			let columnOfFour = [i, i + width, i + width * 2, i + width * 3];
			const isBlank = fruits[i].innerText === '';
			const decidedFruit = fruits[i].innerText;

			if (columnOfFour.every((index) => fruits[index].innerText === decidedFruit && !isBlank)) {
				columnOfFour.forEach((index) => fruits[index].classList.add('combined-fruits'));
				if (fruits[i].classList.contains('combined-fruits')) playSound(ohlalaSound, false);
				if (fruits[i].classList.contains('combined-fruits')) playSound(matchSound, false, 0.2);
				setTimeout(
					() => columnOfFour.forEach((index) => fruits[index].classList.remove('combined-fruits')),
					300
				);
				setTimeout(() => columnOfFour.forEach((index) => (fruits[index].innerText = '')), 300);
				setTimeout(() => updateMissionNumber(decidedFruit, 4), 300);
				canMatch = false;
			}
		}
	}
}
function checkRowForFive() {
	if (canMatch) {
		for (let i = 0; i < 32; i++) {
			let rowOfFive = [i, i + 1, i + 2, i + 3, i + 4];
			const isBlank = fruits[i].innerText === '';
			const decidedFruit = fruits[i].innerText;

			const notValid = [2, 3, 4, 5, 8, 9, 10, 11, 14, 15, 16, 17, 20, 21, 22, 23, 26, 27, 28, 29];

			if (notValid.includes(i)) continue;

			if (rowOfFive.every((index) => fruits[index].innerText === decidedFruit && !isBlank)) {
				rowOfFive.forEach((index) => fruits[index].classList.add('combined-fruits'));
				if (fruits[i].classList.contains('combined-fruits')) playSound(magnificSound, false);
				if (fruits[i].classList.contains('combined-fruits')) playSound(matchSound, false, 0.2);
				setTimeout(() => rowOfFive.forEach((index) => fruits[index].classList.remove('combined-fruits')), 300);
				setTimeout(() => rowOfFive.forEach((index) => (fruits[index].innerText = '')), 300);
				setTimeout(() => updateMissionNumber(decidedFruit, 5), 300);
				canMatch = false;
			}
		}
	}
}
function checkColumnForFive() {
	if (canMatch) {
		for (let i = 0; i < 12; i++) {
			let columnOfFive = [i, i + width, i + width * 2, i + width * 3, i + width * 4];
			const isBlank = fruits[i].innerText === '';
			const decidedFruit = fruits[i].innerText;

			if (columnOfFive.every((index) => fruits[index].innerText === decidedFruit && !isBlank)) {
				columnOfFive.forEach((index) => fruits[index].classList.add('combined-fruits'));
				if (fruits[i].classList.contains('combined-fruits')) playSound(magnificSound, false);
				if (fruits[i].classList.contains('combined-fruits')) playSound(matchSound, false, 0.2);
				setTimeout(
					() => columnOfFive.forEach((index) => fruits[index].classList.remove('combined-fruits')),
					300
				);
				setTimeout(() => columnOfFive.forEach((index) => (fruits[index].innerText = '')), 300);
				setTimeout(() => updateMissionNumber(decidedFruit, 5), 300);
				canMatch = false;
			}
		}
	}
}
function swapFruit(fruit1, fruit2) {
	checkForLose();
	let validMoves = getCloseFruits(fruit1);
	let isValidMove = validMoves.includes(parseInt(fruit2.className));

	if (isValidMove) {
		updateMoveContainer();
		let temp = fruit2.innerText;
		fruit2.innerText = fruit1.innerText;
		fruit1.innerText = temp;
		playSound(popSound, false, 0.5);
	}
}
function startLoop() {
	stoploop = setInterval(() => {
		moveFruitDown();
		checkRowForFive();
		checkColumnForFive();
		checkRowForFour();
		checkColumnForFour();
		checkRowForThree();
		checkColumnForThree();

		checkForWin();
		checkForLose();
		canMatch = true;
	}, 500);
}
function stopLoop() {
	clearInterval(stoploop);
}
function showSection(element) {
	element.style.display = '';
	element.style.visibility = 'visible';
}
function hideSection(element) {
	element.style.display = 'none';
	element.style.visibility = 'hidden';
}
function showWinScreen() {
	missionWinLevel.innerText = `Level: ${level}`;
	document.cookie = `${cookieLife}=${lifes}; path=/;`;
	document.cookie = `${cookieLevel}=${level}; path=/;`;
	updateLifesScreen();

	hideSection(grid);
	showSection(missionCompletedContainer);
}
function showFailScreen() {
	if (lifes !== 0) {
		--lifes;
		document.cookie = `${cookieLife}=${lifes}; path=/;`;
		document.cookie = `${cookieLevel}=${level}; path=/;`;
	}

	if (lifes === 0 && homeCountdown.lastElementChild.innerText === '⏰ 00:00') {
		deadline = new Date(Date.parse(new Date()) + MinuteForNewLife * 60 * 1000);
		initializeClock(deadline);
	}

	missionFailLevel.innerText = `Level: ${level}`;
	updateLifesScreen();

	hideSection(grid);
	showSection(missionFailedContainer);
}
function showHomeScreen() {
	stopSound(completedSound);
	updateLifesScreen();

	stopSound(gameoverSound);
	hideSection(missionFailedContainer);
	hideSection(missionCompletedContainer);
	hideSection(missionContainer);
	hideSection(grid);
	showSection(homeContainer);
}
function updateLifesScreen() {
	lifes = lifes;
	missionFailLife.innerText = `Lifes: ${lifes}❤️`;
	missionWinLife.innerText = `Lifes: ${lifes}❤️`;
	homeLife.innerText = `Life: ${lifes}❤️`;
}
function notLifeMessage() {
	startCountdown();
	let message = 'You Dont Have Lifes😢';
	let message1 = '⬇️New Life In⬇️';
	let timer = 'Time: ⏰ 30:00';
	playSound(notLifeSound, false)

	let messageSpan = document.createElement('span');
	let messageSpan1 = document.createElement('span');
	let timeSpan = homeCountdown.querySelector('.timer').cloneNode(true);
	messageSpan.innerText = message;
	messageSpan1.innerText = message1;
	// timerSpan.innerText = `Time: ⏰ ${minutesS} : ${secondsS}`;

	let tt = setInterval(() => {
		timeSpan.innerText = homeCountdown.querySelector('.timer').innerText;
	}, 1000);

	let popup = document.createElement('div');
	let button = goHomeButton.cloneNode(true);

	popup.classList.add('not__life__popup');
	popup.appendChild(messageSpan);
	popup.appendChild(messageSpan1);
	popup.appendChild(timeSpan);
	popup.appendChild(button);
	document.querySelector('.container').appendChild(popup);
	button.onclick = () => {
		clearInterval(tt);
		showHomeScreen();
		popup.remove();
	};
}
function startCountdown() {
	if (lifes === 0 && document.querySelector('.timer').innerText === '⏰ 00:00') {
		deadline = new Date(Date.parse(new Date()) + MinuteForNewLife * 60 * 1000);
		initializeClock(deadline);
	}
}

function getLifeAndLevelFromCookie() {
	if (document.cookie && document.cookie.match(cookieLife) || document.cookie.match(cookieLevel)) {
		var cookies = document.cookie
			.split(';')
			.map((cookie) => cookie.split('='))
			.reduce((accumulator, [key, value]) => ({ ...accumulator, [key.trim()]: decodeURIComponent(value) }), {});


		if (cookies[cookieLife]) lifes = parseInt(cookies[cookieLife]);
		if (cookies[cookieLevel]) level = parseInt(cookies[cookieLevel]);
	}
}

async function registerSW() {
	if ("serviceWorker" in navigator) {
		try {
			await navigator.serviceWorker.register("./sw.js");
		} catch (error) {
			console.log("ServiceWorker registration failed")
		}
	}
}