const cookieName = "myCountdown";
let deadline = 0;
let timeinterval;
let minutesS;
let secondsS;

function getStoragedDeadline() {
    if (document.cookie && document.cookie.match(cookieName)) {
        var cookies = document.cookie
            .split(";")
            .map(cookie => cookie.split("="))
            .reduce((accumulator, [key, value]) =>
                ({ ...accumulator, [key.trim()]: decodeURIComponent(value) }),
                {});

        initializeClock(cookies[cookieName]);
        console.log(cookies[cookieName]);
    }
}
getStoragedDeadline();


function getTimeRemaining(endtime) {
    const total = Date.parse(endtime) - Date.parse(new Date());
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    return { total, minutes, seconds };
}

function initializeClock(endtime) {
    const timerSpan = document.querySelector('.timer');

    function updateClock() {
        const t = getTimeRemaining(endtime);
        minutesS = ('0' + t.minutes).slice(-2);
        secondsS = ('0' + t.seconds).slice(-2);
        timerSpan.innerText = `⏰ ${minutesS} : ${secondsS}`;

        if (minutesS % 2 === 0 && secondsS > 58) {
            ++lifes;
            document.cookie = `${cookieLife}=${lifes}; path=/;`;
            document.cookie = `${cookieLevel}=${level}; path=/;`;
            updateLifesScreen()

        }

        if (t.total <= 0) {
            deleteCookie(cookieName);
            clearInterval(timeinterval);
        }
    }
    updateClock();

    timeinterval = setInterval(updateClock, 1000);
    // Save deadline to cookie
    document.cookie = `${cookieName}=${deadline}; path=/;`;
}

function deleteCookie(cookieName) {
    if (document.cookie && document.cookie.match(cookieName)) {
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`
    }
}


// const deadline = new Date(Date.parse(new Date()) + 30 * 60 * 1000);
// initializeClock(deadline);


