let startX = 0;
let startY = 0;
let endX = 0;
let endY = 0;


function isMobile() {
	if (window.innerWidth < 768) {
		return true
	} else {
		return false
	}
}
function touchStart(event) {
	firstFruitTarget = event.target;
	firstFruitTarget.classList.add('rotate');

}

function touchEnd(event) {
	event.stopPropagation();
	var changedTouch = event.changedTouches[0];
	var element = document.elementFromPoint(changedTouch.clientX, changedTouch.clientY)
	secondFruitTarget = element;
	firstFruitTarget.classList.remove('rotate');
	swapFruit(firstFruitTarget, secondFruitTarget);
}

