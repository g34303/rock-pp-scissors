// function to get random number
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// function to hide elements
function removeElement(element) {
const rm = document.getElementById(element);
rm.style.visibility = "hidden";
rm.style.opacity = "0";
}

// function to show elements
function showElement(element) {
const sh = document.getElementById(element);
sh.style.visibility = "visible";
sh.style.opacity = "1";
}

// exit prescreen continue with loading animation
function loadGame() {
  removeElement("prescreen");
  document.getElementById("midscreen").style.display = "";
  setTimeout(() => {
    document.getElementsByClassName("animated-text")[0].innerText = `Player Found`;
    setTimeout(() => {
      document.getElementsByClassName("animated-text")[0].innerText = `Starting Game`;
      setTimeout(() => {
      console.log('chicken');
      document.getElementById("mainscreen").style.display = "";
      document.getElementById("midscreen").style.display = "none";
      startTimer();
      }, 1500);
    }, 1500);
  }, getRandomIntInclusive(1500,5500));
}

// display mainscreen start timer and game
function startGame() {
    removeElement("prescreen");
    removeElement("midscreen");
    document.getElementById("mainscreen").style.display = "";
    startTimer();
}

// shortcut to skip to mainscreen
let keyCount = 0;
const targetKey = "`";
const triggerCount = 3; 

document.addEventListener("keydown", (event) => {
  if (event.key === targetKey) {
    keyCount++;
    if (keyCount >= triggerCount) {
    removeElement("prescreen");
    removeElement("midscreen");
    document.getElementById("mainscreen").style.display = "";
    startTimer();
  }
  }
});

// ideally this shouldn't have innerHTML
function saveUserInput() {
  let userInput =  document.getElementById('name-input').value.trim();

    if (userInput !== "") {
      if (userInput.length >= 30) {
        userInput = userInput.slice(0, 30) + "...";
      }
        document.getElementById("chatbox").style.display = "none"; // hide image
        document.getElementById("chatbox-wrapper").innerHTML = `<h1 id="player1name">${userInput}</h1>
                    <div style="margin-top: -28px;" id="triangle-mini">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#005AFF" version="1.1" id="Capa_1" viewBox="0 0 96.154 96.154" xml:space="preserve">
                    <g>
                        <path d="M0.561,20.971l45.951,57.605c0.76,0.951,2.367,0.951,3.127,0l45.956-57.609c0.547-0.689,0.709-1.716,0.414-2.61   c-0.061-0.187-0.129-0.33-0.186-0.437c-0.351-0.65-1.025-1.056-1.765-1.056H2.093c-0.736,0-1.414,0.405-1.762,1.056   c-0.059,0.109-0.127,0.253-0.184,0.426C-0.15,19.251,0.011,20.28,0.561,20.971z"/>
                    </g>
                    </svg>
                    </div>
        `;
    }
}

document.getElementById('start-game').addEventListener('click', () => {
      saveUserInput();
});

document.getElementById('name-input').addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    saveUserInput();
  }
});

document.getElementById('skip-btn').addEventListener('click', () => {
      startGame();
});

//come up with a username for p2
// const usernamePartOne = ["ominous", "demure", "verdant", "resolute", "zesty", "eerie", "perky", "opulent"];
// const usernamePartTwo = ["bird", "dog", "cat", "chicken", "pig", "mongoose", "worm"];

const username = ["ialwayspickpaper", "BlazeIt420", "b00baLuver69", "stinkyUwU", "sigmafreud", "norman", "bigchVngus"];

//const player2name = usernamePartOne[getRandomIntInclusive(0,usernamePartOne.length - 1)] + usernamePartTwo[getRandomIntInclusive(0,usernamePartTwo.length - 1)] + getRandomIntInclusive(0,9) + getRandomIntInclusive(0,9) + getRandomIntInclusive(0,9);

const player2name = username[getRandomIntInclusive(0,username.length - 1)];

document.getElementById("player2name").innerText = player2name;


// enables start-game button if user inputs their name
document.getElementById("name-input").addEventListener("input", () => {
  if (document.getElementById("name-input").value.trim() !== "") {
    document.getElementById("start-game").removeAttribute("disabled");
  } else {
    document.getElementById("start-game").setAttribute("disabled","");
  }
});

document.getElementById("start-game").addEventListener("click", loadGame);
document.getElementById("name-input").addEventListener("keydown", (key) => {
  if (key.key === "Enter" && document.getElementById("name-input").value.trim() !== "") {
    loadGame();
  }
});

// for the timer
const FULL_DASH_ARRAY = 283;
const WARNING_THRESHOLD = 9;
const ALERT_THRESHOLD = 3;

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

const TIME_LIMIT = 20;
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
// $(document).ready(function () { 
//     var images = $("#played-hand img"),
//         count = images.length,
//         transitions = 1,
//         cycleTimeout = null, // store the timeout ID
//         cycling = true; // flag to track if cycling is active

//     TweenMax.set(images, { autoAlpha: 0 });
//     TweenMax.set($(".active"), { autoAlpha: 1 });

//     function fadeImage() {
//         if (!cycling) return; // stop if cycling is turned off

//         var active = $("#played-hand .active"),
//             next = active.next().length ? active.next() : images.first();

//         TweenMax.set(active, { autoAlpha: 0, className: "-=active" });
//         TweenMax.set(next, {
//             autoAlpha: 1,
//             className: "+=active",
//             onComplete: nextImage
//         });

//         transitions++;
//     }

//     function nextImage() {
//         if (!cycling) return; // stop if cycling is turned off

//         if (transitions < count) {
//             cycleTimeout = setTimeout(fadeImage, 1000);
//         } else {
//             transitions = 0;
//             TweenMax.set(images[0], { autoAlpha: 1, className: "+=active" });
//             cycleTimeout = setTimeout(fadeImage, 1000);
//         }
//     }

//     cycleTimeout = setTimeout(fadeImage, 1000);

// click on a hand to make it active and stop cycling
document.querySelectorAll("#p1-buttons button").forEach(btn => {
    btn.addEventListener("click", () => {
        // Remove active from all buttons
        document.querySelectorAll("#p1-buttons button")
            .forEach(b => b.classList.remove("active"));

        // Set clicked button active
        btn.classList.add("active");
        document.getElementById("confirm-button")?.removeAttribute("disabled");

        // Stop cycling (if vars exist in scope)
        if (typeof cycling !== "undefined") cycling = false;
        if (typeof cycleTimeout !== "undefined") clearTimeout(cycleTimeout);

        // Hide all played-hand images
        document.querySelectorAll("#played-hand img").forEach(img => {
            img.hidden = true;
            img.classList.remove("active");
        });

        // Find the shared class between button and image
        const matchClass = [...btn.classList].find(c =>
            c !== "active" // skip active class
        );

        if (matchClass) {
            document.querySelectorAll("#played-hand img." + matchClass).forEach(img => {
                img.hidden = false;
                img.classList.add("active");
                removeElement('arrow-guide');
                showElement(img.id);
                console.log(img.id);
            });
        }
    });
});

document.getElementById('confirm-button').addEventListener("click", () => {
    removeElement('confirm-button');
    removeElement("timer");
    document.getElementById("wrapper").innerHTML = `
                   <svg class="approve_icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                        <circle class="approve_icon_circle" cx="26" cy="26" r="25" fill="none" />
                        <path class="approve_icon_check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                    </svg>
    `;
    document.querySelectorAll("#p1-buttons button").forEach(btn => { 
      if (!btn.classList.contains('active')) {
        btn.setAttribute("disabled", "");
      }
    });
});
//});
