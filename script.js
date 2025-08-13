// function to hide elements
function removeElement(element) {
const tm = document.getElementById(element);
tm.style.visibility = "hidden";
tm.style.opacity = "0";
}

// start timer and hide prescreen
function startGame() {
  removeElement("prescreen");
  document.getElementById("mainscreen").style.display = "";
  startTimer();
}

// hide prescreen shortcut
let keyCount = 0;
const targetKey = "`";
const triggerCount = 3; 

document.addEventListener("keydown", (event) => {
  if (event.key === targetKey) {
    keyCount++;
    if (keyCount >= triggerCount) {
    startGame();
  }
  }
});

//come up with a username for p2
// const usernamePartOne = ["ominous", "demure", "verdant", "resolute", "zesty", "eerie", "perky", "opulent"];
// const usernamePartTwo = ["bird", "dog", "cat", "chicken", "pig", "mongoose", "worm"];

const username = ["ialwayspickpaper", "BlazeIt420", "b00baLuver69", "stinkyUwU", "sigmafreud", "norman", "bigchVngus"];

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

//const player2name = usernamePartOne[getRandomIntInclusive(0,usernamePartOne.length - 1)] + usernamePartTwo[getRandomIntInclusive(0,usernamePartTwo.length - 1)] + getRandomIntInclusive(0,9) + getRandomIntInclusive(0,9) + getRandomIntInclusive(0,9);

const player2name = username[getRandomIntInclusive(0,username.length - 1)];

document.getElementById("player2name").innerText = player2name;


// enables start-game button if user inputs their name
document.getElementById("name-input").addEventListener("input", () => {
  if (document.getElementById("name-input").value.trim() !== "") {
    document.getElementById("start-game").removeAttribute("disabled");
    console.log("user entered something");
  } else {
    document.getElementById("start-game").setAttribute("disabled","");
    console.log("input is blank")
  }
});

document.getElementById("start-game").addEventListener("click", startGame);
document.getElementById("name-input").addEventListener("keydown", (key) => {
  if (key.key === "Enter" && document.getElementById("name-input").value.trim() !== "") {
    startGame();
  }
});

//for the timer
const FULL_DASH_ARRAY = 283;
const WARNING_THRESHOLD = 3;
const ALERT_THRESHOLD = 1;

const COLOR_CODES = {
  info: {
    color: "green"
  },
  warning: {
    color: "orange",
    threshold: WARNING_THRESHOLD
  },
  alert: {
    color: "red",
    threshold: ALERT_THRESHOLD
  }
};

const TIME_LIMIT = 10;
let timePassed = 0;
let timeLeft = TIME_LIMIT;
let timerInterval = null;
let remainingPathColor = COLOR_CODES.info.color;

document.getElementById("timer").innerHTML = `
<h2> Choose your hand</h2>
<div class="base-timer">
  <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <g class="base-timer__circle">
      <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
      <path
        id="base-timer-path-remaining"
        stroke-dasharray="283"
        class="base-timer__path-remaining ${remainingPathColor}"
        d="
          M 50, 50
          m -45, 0
          a 45,45 0 1,0 90,0
          a 45,45 0 1,0 -90,0
        "
      ></path>
    </g>
  </svg>
  <span id="base-timer-label" class="base-timer__label">${formatTime(
    timeLeft
  )}</span>
</div>
`;

function onTimesUp() {
  clearInterval(timerInterval);
}

function startTimer() {
  timerInterval = setInterval(() => {
    timePassed = timePassed += 1;
    timeLeft = TIME_LIMIT - timePassed;
    document.getElementById("base-timer-label").innerHTML = formatTime(
      timeLeft
    );
    setCircleDasharray();
    setRemainingPathColor(timeLeft);

    if (timeLeft === 0) {
      onTimesUp();
      setTimeout(removeElement("timer"), 500);
    }
  }, 1000);
}

function formatTime(time) {
  const minutes = Math.floor(time / 60);
  let seconds = time % 60;

  if (seconds < 10) {
    seconds = `0${seconds}`;
  }

  return `${minutes}:${seconds}`;
}

function setRemainingPathColor(timeLeft) {
  const { alert, warning, info } = COLOR_CODES;
  if (timeLeft <= alert.threshold) {
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(warning.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.add(alert.color);
  } else if (timeLeft <= warning.threshold) {
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(info.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.add(warning.color);
  }
}

function calculateTimeFraction() {
  const rawTimeFraction = timeLeft / TIME_LIMIT;
  return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
}

function setCircleDasharray() {
  const circleDasharray = `${(
    calculateTimeFraction() * FULL_DASH_ARRAY
  ).toFixed(0)} 283`;
  document
    .getElementById("base-timer-path-remaining")
    .setAttribute("stroke-dasharray", circleDasharray);
}

//cycle through the pictures
    $(document).ready(function () {
    var images = $("#played-hand img"),
        count = images.length,
        transitions = 1;

    TweenMax.set(images, { autoAlpha: 0 });
    TweenMax.set($(".active"), { autoAlpha: 1 });

    function fadeImage() {
        var active = $("#played-hand .active"),
        next = active.next();

        TweenMax.set(active, { autoAlpha: 0, className: "-=active" });
        TweenMax.set(next, {
        autoAlpha: 1,
        className: "+=active",
        onComplete: nextImage
        });

        transitions++;
        
    }

    setTimeout(fadeImage, 1000);

    function nextImage() {
        if (transitions < count) {
        setTimeout(fadeImage, 1000);
        } else {
        transitions = 0;
        TweenMax.set(images[0], { autoAlpha: 1, className: "+=active" });
        setTimeout(fadeImage, 1000);
        }
    }
    });

// click on a hand to make it active
document.querySelectorAll("#p1-buttons button").forEach(btn => {
   btn.addEventListener("click", () => {
    document.querySelectorAll("#p1-buttons button").forEach(b => b.classList.remove("active"));
    btn.classList.add('active');
    document.getElementById("confirm-button").removeAttribute("disabled");
    }); 
});
