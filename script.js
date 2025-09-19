// playable hands in this game

const playableHands = {
  1: () => "rock",
  2: () => "paper",
  3: () => "scissors",
};

const outcome = {
  "rock-rock": "tie",
  "rock-paper": "p2",
  "rock-scissors": "p1",
  "paper-rock": "p1",
  "paper-paper": "tie",
  "paper-scissors": "p2",
  "scissors-rock": "p2",
  "scissors-paper": "p1",
  "scissors-scissors": "tie",
};

let numOfWinsP1 = 0;
let numOfWinsP2 = 0;
let numOfLossesP1 = 0;
let numOfLossesP2 = 0;
let player1hand = null;
let confirmCliked = false;
let lastOpponentName = null;
let opponentHistory = [];
let savedPlayer1Name = "";

document.getElementById("confirm-button").addEventListener("click", () => {
  confirmCliked = true;
  continueRound();
});

function getWinner(p1, p2) {
  return outcome[`${p1}-${p2}`] ?? null; // null = invalid input
}

// function to get random number
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// function to hide elements
function removeElement(element) {
  const rm = document.getElementById(element);
  rm.style.display = "none";
}

function hideElement(element) {
  const hd = document.getElementById(element);
  hd.style.visibility = "hidden";
}

// function to show elements
function showElement(element) {
  const sh = document.getElementById(element);
  sh.style.visibility = "visible";
}

// function to fade and hide
function fadeAndHide(elements, duration = 500) {
  elements.forEach(el => {
    el.classList.add("fade-out");
    setTimeout(() => el.classList.add("hidden"), duration);
  });
}

// function to remove fade and hide class
function removeFadeAndHide(elements) {
  elements.forEach(el => {
    el.classList.remove("fade-out");
    el.classList.remove("hidden");
  });
}

function loadGame() {
  // reset animated text right away
  const animText = document.getElementsByClassName("animated-text")[0];
  if (animText) {
    animText.innerText = "Looking for Player";
  }

  // pick a fresh opponent name that isn’t in the last 3
  let newName;
  do {
    newName = username[getRandomIntInclusive(0, username.length - 1)];
  } while (opponentHistory.includes(newName) && username.length > 3);

  // update the history
  opponentHistory.push(newName);
  if (opponentHistory.length > 3) {
    opponentHistory.shift(); // remove the oldest name
  }

  document.getElementById("player2name").innerText = newName;

  removeElement("prescreen");
  document.getElementById("midscreen").style.display = "";
  setTimeout(() => {
    document.getElementsByClassName("animated-text")[0].innerText = `Player Found`;
    setTimeout(() => {
      document.getElementsByClassName("animated-text")[0].innerText = `Starting Game`;
      setTimeout(() => {
        startGame();
        startRound();
        // resetRound();
      }, 1500);
    }, 1500);
  }, getRandomIntInclusive(1500, 5500));
}

// start the round
function startRound() {
  startTimer();
  setTimeout(() => {
    document.getElementById("thinking").innerHTML = `
                   <svg class="approve_icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                        <circle class="approve_icon_circle" cx="26" cy="26" r="25" fill="none" />
                        <path class="approve_icon_check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                    </svg>
        `;
    document.getElementById(
      "p2side"
    ).innerHTML = `<img src="https://dabonsym.com/wp-content/uploads/2025/08/questionmark-150-min.png" height="200" draggable="false">`;
    const p2QuestionMark = document.querySelector("#p2side img");
    if (p2QuestionMark) {
      p2QuestionMark.dataset.readyState = "question";
      p2QuestionMark.hidden = false;
    }
    document.querySelectorAll("#p2-buttons img").forEach((s) => {
      const questionMarkSrc =
        "https://dabonsym.com/wp-content/uploads/2025/08/questionmark-150-min.png";
      if (s.src !== questionMarkSrc) {
        s.src = questionMarkSrc;
      }
      s.style.visibility = "visible";
      s.style.transform = "scaleX(1)";
      document.querySelectorAll("#p2-buttons button.active").forEach((btn) => {
        btn.style.padding = "22px 41px 22px 41px";
      });
    });
    document
      .querySelectorAll("#p2-buttons button")
      .forEach((b) => b.classList.add("active"));
    if (
      document.querySelector("#p1-buttons button.active") &&
      timeLeft > 0 &&
      confirmCliked === true
    ) {
      changeTimer();
      revealHand();
    }
    // }, 500);
  }, getRandomIntInclusive(3000, 9000));
  console.log("start round");
}

// click on a hand to make it active and stop cycling

function player1ButtonClick() {
  document.querySelectorAll("#p1-buttons button").forEach((btn) => {
    btn.addEventListener("click", () => {
      // Remove active from all buttons
      document
        .querySelectorAll("#p1-buttons button")
        .forEach((b) => b.classList.remove("active"));

      // Set clicked button active
      btn.classList.add("active");

      document.getElementById("confirm-button")?.removeAttribute("disabled");

      // Stop cycling (if vars exist in scope)
      if (typeof cycling !== "undefined") cycling = false;
      if (typeof cycleTimeout !== "undefined") clearTimeout(cycleTimeout);

      // Hide all played-hand images and clear any lingering shaking classes
      document.querySelectorAll("#played-hand img").forEach((img) => {
        img.hidden = true;
        img.classList.remove("active");
        img.classList.remove("shaking-animation");
        img.classList.remove("shaking-animation-p2");
        img.style.filter = "";
        img.style.transform = "";
      });

      // Find the shared class between button and image
      const matchClass = [...btn.classList].find(
        (c) => c !== "active" // skip active class
      );

      if (matchClass) {
        setP1Selection(matchClass);
        player1hand = matchClass;
      }
    });
  });
}

// helper to set P1 selection consistently
function setP1Selection(hand) {
  // hide and clear all P1 images
  document.querySelectorAll("#played-hand img").forEach((img) => {
    img.hidden = true;
    img.classList.remove("active");
    img.classList.remove("shaking-animation");
    img.classList.remove("shaking-animation-p2");
    img.style.filter = "";
    img.style.transform = "";
  });

  const sel = document.querySelector(`#played-hand img.${hand}`);
  if (sel) {
    sel.hidden = false;
    sel.classList.add("active");
    hideElement("arrow-guide");
    showElement(sel.id);
  }
}

function countdownToRound() {
  let countdown = 3;
  const countdownElement = document.getElementById("countdown");
  const nextroundElement = document.getElementById("nextround");
  countdownElement.innerText = countdown;
  setTimeout(() => {
    nextroundElement.style.visibility = "visible";
    const interval = setInterval(() => {
      countdown--;
      countdownElement.innerText = countdown;
      if (countdown === 0) {
        clearInterval(interval);
        nextroundElement.style.visibility = "hidden";
        // only reset if nobody has won yet
        if (numOfWinsP1 < 2 && numOfWinsP2 < 2) {
          resetRound();
        }
      }
    }, 1000);
  }, 1500);

  console.log("countdown to round");
}

function continueRound() {
  hideElement("confirm-button");
  if (document.querySelector("#p2-buttons button.active")) {
    changeTimer();
    revealHand();
  }
  document.getElementById("wrapper").innerHTML = `
                   <svg class="approve_icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                        <circle class="approve_icon_circle" cx="26" cy="26" r="25" fill="none" />
                        <path class="approve_icon_check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                    </svg>
    `;
  document.querySelectorAll("#p1-buttons button").forEach((btn) => {
    if (!btn.classList.contains("active")) {
      btn.setAttribute("disabled", "");
    }
  });
}

function playAgain() {
    const btn = document.getElementById("playagain-btn");
    btn.style.visibility = "visible";
    btn.removeAttribute("disabled");
    btn.onclick = () => {
      numOfWinsP1 = 0;
      numOfWinsP2 = 0;
      numOfLossesP1 = 0;
      numOfLossesP2 = 0;

      document.querySelectorAll(".winorloss-dot").forEach((dot) => {
        dot.classList.remove("win-dot", "loss-dot");
        dot.style.visibility = "hidden";
      });

      // hide the play again button until next time
      btn.style.visibility = "hidden";
      btn.setAttribute("disabled", "");

      // hide mainscreen UI so only loading screens are visible
      document.getElementById("mainscreen").style.display = "none";

      // if there is a saved name then load it for p1
      const p1Name = document.getElementById("player1name");
      if (p1Name) {
      p1Name.innerText = savedPlayer1Name;
      }

      const p2Name = document.getElementById("player2name");
      if (p2Name) p2Name.innerText = "";

      // reset P1 + P2 button actives
      document.querySelectorAll("#p1-buttons button, #p2-buttons button").forEach((btn) => {
      btn.classList.remove("active");
      });
          
      document.getElementById("p2side").innerHTML = "";

        document.querySelectorAll("#played-hand img, #played-hand-p2 img").forEach(img => {
        img.hidden = true;
        img.classList.remove("active");
    img.style.filter = "";
    img.style.transform = "";
    // ensure any shaking classes are removed so animation doesn't persist
    img.classList.remove("shaking-animation");
    img.classList.remove("shaking-animation-p2");
      });

      // go back to "finding another player"
      // resetRound();
      resetGameUI();
      loadGame();
      removeFadeAndHide(document.querySelectorAll("#wrapper"));
      removeFadeAndHide(document.querySelectorAll("#thinking"));
      document.getElementById('wrapper').innerHTML = ``;
  };
}

function resetRoundVars() {
  confirmCliked = false;
  player1hand = null;
  timePassed = 0;
  timeLeft = TIME_LIMIT;
}

function resetGameUI() {
  // hide the winner animation
  const winnerAnim = document.getElementById("winner-container");
  if (winnerAnim) {
      document.getElementById('p1-winner-slot').innerHTML = ``;
      document.getElementById('p2-winner-slot').innerHTML = ``;    
}
  // hide tie animation
  const tieAnim = document.getElementById("tie-container");
  if (tieAnim) {
      document.getElementById('tie-slot').innerHTML = ``;
  }
  // hide and disable play again button
  const playAgainBtn = document.getElementById("playagain-btn");
  if (playAgainBtn) {
    playAgainBtn.style.visibility = "hidden";
    playAgainBtn.setAttribute("disabled", "");
  }

  // reset confirm button
  const confirmBtn = document.getElementById("confirm-button");
  if (confirmBtn) {
    confirmBtn.setAttribute("disabled", "");
    showElement("confirm-button");
  }

  document.querySelectorAll("#p1-buttons button").forEach((btn) => {
    btn.style.display = "";
    btn.removeAttribute("disabled");
    btn.classList.remove("active");
  });

  document.querySelectorAll("#p2-buttons button").forEach((btn) => {
    btn.style.display = "";
    btn.classList.remove("active");
  });

  document.querySelectorAll("#played-hand img").forEach((img) => {
    img.hidden = true;
    img.classList.remove("active");
    img.style.filter = "";
    img.style.transform = "";
  });

  document.querySelectorAll("#played-hand-p2 img").forEach((img) => {
    img.hidden = true;
    img.classList.remove("active");
    img.style.filter = "";
    img.style.transform = "";
    img.style.transform = "scaleX(1) scale(1)";
  });

  let p2sideImg = document.querySelector("#p2side img");
  if (!p2sideImg) {
    p2sideImg = document.createElement("img");
    document.getElementById("p2side").appendChild(p2sideImg);
  }
  p2sideImg.src =
    "https://dabonsym.com/wp-content/uploads/2025/08/questionmark-150-min.png";
  p2sideImg.dataset.readyState = "question";
  p2sideImg.style.transform = "scale(1) scaleX(1)";
  p2sideImg.style.filter = "";
  p2sideImg.style.height = "200px";
  p2sideImg.setAttribute('draggable', 'false');
  p2sideImg.hidden = false;

  document.querySelectorAll("#p2-buttons img").forEach((s) => {
    s.src =
      "https://dabonsym.com/wp-content/uploads/2025/08/questionmark-150-min.png";
    s.style.visibility = "visible";
    s.style.transform = "scaleX(1)";
  });

  document.querySelectorAll("#p2-buttons button").forEach((btn) => {
    btn.classList.remove("active");
    btn.style.padding = "22px 41px 22px 41px"; // reset to square padding
  });

  const thinking = document.getElementById("thinking");
  if (thinking) {
    thinking.innerHTML = `<h1>Selecting<span class="dots"></span></h1>`;
  }

  document.querySelectorAll("svg.approve_icon").forEach((el) => {
    el.style.visibility = "hidden";
  });
  document.querySelectorAll(".radial_stripes").forEach((el) => {
    el.style.visibility = "hidden";
  });

  showElement("arrow-guide");

  document.querySelectorAll("#p1-buttons button").forEach((btn) => {
  btn.style.display = "";
  btn.removeAttribute("disabled");
  btn.classList.remove("active");
  });
  removeFadeAndHide(document.querySelectorAll("#p1-buttons button"));

  document.querySelectorAll("#p2-buttons button").forEach((btn) => {
  btn.style.display = "";
  btn.classList.remove("active");
  });
  removeFadeAndHide(document.querySelectorAll("#p2-buttons button"));
}

function resetRound() {
  // stop if game is over
  if (numOfWinsP1 >= 2 || numOfWinsP2 >= 2) {
    return;
  }
  // const wrapper = document.getElementById("wrapper");
  // if (wrapper) {
  //   wrapper.classList.remove("fade-out", "hidden");
  //   wrapper.innerHTML = `
  //     <svg class="approve_icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
  //         <circle class="approve_icon_circle" cx="26" cy="26" r="25" fill="none" />
  //         <path class="approve_icon_check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
  //     </svg>
  //   `;
  // }
  resetGameUI();
  // removeFadeAndHide(document.querySelectorAll("svg.approve_icon"));
  removeFadeAndHide(document.querySelectorAll("#thinking"));
  removeFadeAndHide(document.querySelectorAll("#wrapper"));
  removeFadeAndHide(document.querySelectorAll("#p2-buttons button"));
  removeFadeAndHide(document.querySelectorAll("#p2-buttons button"));
  // removeFadeAndHide(document.querySelectorAll(".radial_stripes"));
  removeFadeAndHide(document.querySelectorAll("#p1-buttons button"));
  document.getElementById('tie-slot').innerHTML = "";
  // stop shaking only on the P1 active image (if any)
  const activeP1Img = document.querySelector("#played-hand img.active");
  if (activeP1Img) activeP1Img.classList.remove("shaking-animation");
  // reset and start timer
  resetRoundVars();
  resetTimer();
  startRound();

  console.log("reset round");
}

// display mainscreen start timer and game
function startGame() {
  removeElement("prescreen");
  removeElement("midscreen");
  document.getElementById("mainscreen").style.display = "";
  // reset all UI state for a new opponent
  resetRoundVars();
  resetTimer();
}

function showWinner() {
  const svg = selectSVG('winner-svg');
  const text = document.getElementById('text');
  const offscreenText = document.getElementById('offscreen-text');
  const lettersWinner = []; // local array

  text.innerHTML = "";

  const word = "WINNER".split("");
  addLetters(word, text, offscreenText, svg, lettersWinner);
  resizeLetters(text, lettersWinner);

  window.addEventListener('resize', () => resizeLetters(text, lettersWinner));
}

function showTie() {
  const svg = selectSVG('tie-svg');
  const text = document.getElementById('tie-text');
  const offscreenText = document.getElementById('tie-offscreen-text');
  const lettersTie = []; // local array

  text.innerHTML = "";

  const word = "TIE".split("");
  addLetters(word, text, offscreenText, svg, lettersTie);
  resizeLetters(text, lettersTie);

  window.addEventListener('resize', () => resizeLetters(text, lettersTie));
}

// reveal p2 hand
function revealHand() {
  let player2hand = playableHands[getRandomIntInclusive(1, 3)]();
  setTimeout(() => {
    // fadeAndHide(document.querySelectorAll("svg.approve_icon"));
    fadeAndHide(document.querySelectorAll("#thinking"));
    fadeAndHide(document.querySelectorAll("#wrapper"));
    fadeAndHide(document.querySelectorAll("#p1-buttons button"));
    fadeAndHide(document.querySelectorAll("#p2-buttons button"));
    // fadeAndHide(document.querySelectorAll(".radial_stripes"));

    document.querySelectorAll("#p2-buttons button").forEach((btn) => {
      // remove active from all buttons
      document
        .querySelectorAll("#p2-buttons button")
        .forEach((b) => b.classList.remove("active"));
    });
    // need to flip all imgs on p2 side
    document.querySelector("#p2side img").style.transform = "scaleX(-1)";
    document
      .querySelectorAll("#p2-buttons img")
      .forEach((s) => (s.style.transform = "scaleX(-1)"));
    if (player2hand === "rock") {
      document.querySelector("#p2-buttons button.rock").classList.add("active");
      document.querySelector("#p2-buttons .rock img").src =
        "https://dabonsym.com/wp-content/uploads/2025/09/angled-hand-rock-150px-smaller-min.png";
      document.querySelector("#p2-buttons .paper img").style.visibility =
        "hidden";
      document.querySelector("#p2-buttons .scissors img").style.visibility =
        "hidden";
      document.querySelector("#played-hand-p2 img").src =
        "https://dabonsym.com/wp-content/uploads/2025/09/angled-hand-rock-512px-smaller-min.png";
    } else if (player2hand === "paper") {
      document
        .querySelector("#p2-buttons button.paper")
        .classList.add("active");
      document.querySelector("#p2-buttons .rock img").style.visibility =
        "hidden";
      document.querySelector("#p2-buttons .paper img").src =
        "https://dabonsym.com/wp-content/uploads/2025/08/angled-hand-paper-150px-min.png";
      document.querySelector("#p2-buttons .scissors img").style.visibility =
        "hidden";
      document.querySelector("#played-hand-p2 img").src =
        "https://dabonsym.com/wp-content/uploads/2025/09/angled-hand-paper-512px-min.png";
    } else if (player2hand === "scissors") {
      document
        .querySelector("#p2-buttons button.scissors")
        .classList.add("active");
      document.querySelector("#p2-buttons .rock img").style.visibility =
        "hidden";
      document.querySelector("#p2-buttons .paper img").style.visibility =
        "hidden";
      document.querySelector("#p2-buttons .scissors img").src =
        "https://dabonsym.com/wp-content/uploads/2025/08/angled-hand-scissors-150px-min.png";
      document.querySelector("#played-hand-p2 img").src =
        "https://dabonsym.com/wp-content/uploads/2025/09/angled-hand-scissors-512px-min.png";
    }
    const p2Revealed = document.querySelector("#p2side img");
    if (p2Revealed) {
      p2Revealed.dataset.readyState = "revealed";
      p2Revealed.hidden = false;
    }
    document.querySelectorAll("#p2-buttons button.active").forEach((btn) => {
      btn.style.padding = "22px 11px 22px 11px";
    });

    console.log(player1hand, player2hand);
    let winner = getWinner(player1hand, player2hand);
    console.log(winner);
    // winning animation
    if (winner === "p1") {
      document.querySelector("#played-hand .radial_stripes").style.visibility =
        "visible";
      const activeP1 = document.querySelector("#played-hand img.active");
      if (activeP1) {
        activeP1.style.filter = "drop-shadow(0 0 0.5rem white)";
        activeP1.style.transform = "scale(1.5)";
      } // for some reason sometimes i get null error so putting this here
      numOfWinsP1++;
      numOfLossesP2++;
      document.getElementsByClassName("winorloss-dot")[
      numOfWinsP1 + numOfLossesP1 - 1
      ].classList.add("win-dot");
      document.getElementsByClassName("winorloss-dot")[
        numOfWinsP1 + numOfLossesP1 - 1
      ].style.visibility = "visible";
      document.getElementsByClassName("winorloss-dot")[3 + (numOfWinsP1 + numOfLossesP1 - 1)
      ].classList.add("loss-dot");
        document.getElementsByClassName("winorloss-dot")[3 + (numOfWinsP1 + numOfLossesP1 - 1)
      ].style.visibility = "visible";
      document.getElementById('p1-winner-slot').innerHTML = `
                <div id="winner-container">
                <p id="offscreen-text" class="offscreen-text"></p>
                <p id="text" class="text"></p>
                <svg id="winner-svg"></svg>
                </div>`;
      setTimeout(() => {
      document.getElementById("winner-container").style.display = "block"; 
      showWinner();          
      }, 500);
    } else if (winner === "p2") {
      document.querySelector(
        "#played-hand-p2 .radial_stripes"
      ).style.visibility = "visible";
      document.querySelector("#played-hand-p2 img").style.filter =
        "drop-shadow(0 0 0.5rem white)";
      document.querySelector("#played-hand-p2 img").style.transform +=
        "scale(1.5)";
      numOfWinsP2++;
      numOfLossesP1++;
      document.getElementsByClassName("winorloss-dot")[3 + (numOfWinsP2 + numOfLossesP2 - 1)
      ].classList.add("win-dot");
      document.getElementsByClassName("winorloss-dot")[3 + (numOfWinsP2 + numOfLossesP2 - 1)
      ].style.visibility = "visible";
      document.getElementsByClassName("winorloss-dot")[
      numOfWinsP2 + numOfLossesP2 - 1
      ].classList.add("loss-dot");
      document.getElementsByClassName("winorloss-dot")[
        numOfWinsP2 + numOfLossesP2 - 1
      ].style.visibility = "visible";
        document.getElementById('p2-winner-slot').innerHTML = `
                <div id="winner-container">
                <p id="offscreen-text" class="offscreen-text"></p>
                <p id="text" class="text"></p>
                <svg id="winner-svg"></svg>
                </div>`;    
      setTimeout(() => {
      document.getElementById("winner-container").style.display = "block"; 
      showWinner();          
      }, 500);
    } else {
      document.getElementById('tie-slot').innerHTML = `
        <div id="tie-container">
        <p id="tie-offscreen-text" class="offscreen-text"></p>
        <p id="tie-text" class="text"></p>
        <svg id="tie-svg"></svg>
        </div>`;
        showTie();
      console.log("tie");
    }
    console.log("Player1 Wins: " + numOfWinsP1, "Player2 Wins: " + numOfWinsP2);

    // clear shaking animation classes so they don't persist into the next round
    document.querySelectorAll("#played-hand img, #played-hand-p2 img").forEach(img => {
      if (!img) return;
      img.classList.remove("shaking-animation");
      img.classList.remove("shaking-animation-p2");
    });

    // check to make sure no one has won yet, if so then show the play again button
    (numOfWinsP1 >= 2 || numOfWinsP2 >= 2) ? playAgain() : countdownToRound();
  }, 5000);
  // hide the green checkmarks
  // document.querySelectorAll("svg.approve_icon").forEach((el) => {
  //   el.style.visibility = "hidden";
  // });
  console.log("reveal hand");
}

// change timer to the ready animation
function changeTimer() {
  setTimeout(() => {
    document.getElementById("timer").innerHTML = `
          <div class="demo hide-after">
      <div class="demo__colored-blocks">
        <div class="demo__colored-blocks-rotater">
          <div class="demo__colored-block"></div>
          <div class="demo__colored-block"></div>
          <div class="demo__colored-block"></div>
        </div>
        <div class="demo__colored-blocks-inner"></div>
        <div class="demo__text">Ready</div>
      </div>
      <div class="demo__inner">
        <svg class="demo__numbers" viewBox="0 0 100 100">
          <defs>
            <path class="demo__num-path-1" d="M40,28 55,22 55,78"/>
            <path class="demo__num-join-1-2" d="M55,78 55,83 a17,17 0 1,0 34,0 a20,10 0 0,0 -20,-10"/>
            <path class="demo__num-path-2" d="M69,73 l-35,0 l30,-30 a16,16 0 0,0 -22.6,-22.6 l-7,7"/>
            <path class="demo__num-join-2-3" d="M28,69 Q25,44 34.4,27.4"/>
            <path class="demo__num-path-3" d="M30,20 60,20 40,50 a18,15 0 1,1 -12,19"/>
          </defs>
          <path class="demo__numbers-path" 
                d="M-10,20 60,20 40,50 a18,15 0 1,1 -12,19 
                  Q25,44 34.4,27.4
                  l7,-7 a16,16 0 0,1 22.6,22.6 l-30,30 l35,0 L69,73 
                  a20,10 0 0,1 20,10 a17,17 0 0,1 -34,0 L55,83 
                  l0,-61 L40,28" />
        </svg>
      </div>
    </div>
    `;
    
    setTimeout(() => {
      const rockSrc =
        "https://dabonsym.com/wp-content/uploads/2025/09/angled-hand-rock-512px-smaller-min.png";
      const p2RockSrc =
        "https://dabonsym.com/wp-content/uploads/2025/09/angled-hand-rock-512px-smaller-min.png";

      // Do not overwrite P2's revealed image; revealHand will handle that.
      const p2Container = document.getElementById("p2side");
      let p2played = p2Container?.querySelector("img");

      if (p2Container && !p2played) {
        p2played = document.createElement("img");
        p2played.height = 200;
        p2played.draggable = false;
        p2Container.innerHTML = "";
        p2Container.appendChild(p2played);
      }

      // Always show rock shaking for P1
      const p1Rock = document.querySelector("#played-hand img.rock");
      if (p1Rock) {
        // hide all other hands first
        document.querySelectorAll("#played-hand img").forEach(img => {
          img.hidden = true;
          img.classList.remove("active", "shaking-animation");
        });
        p1Rock.hidden = false;
        p1Rock.classList.add("active", "shaking-animation");
      }

      // Always show rock shaking for P2
      if (p2played) {
        p2played.src = "https://dabonsym.com/wp-content/uploads/2025/09/angled-hand-rock-512px-smaller-min.png";
        p2played.dataset.readyState = "ready-rock";
        p2played.hidden = false;
        p2played.style.transform = "scaleX(-1)";
        p2played.classList.add("shaking-animation-p2");
      }

      // If player explicitly selected rock (player1hand may be 'rock'), ensure it shakes
      if (player1hand === "rock") {
        const userRock = document.querySelector("#played-hand img.rock");
        if (userRock) userRock.classList.add("shaking-animation");
      }

      if (p2played) {
        const readyState = p2played.dataset.readyState ?? "question";
        if (readyState !== "revealed") {
          p2played.src = p2RockSrc;
          p2played.dataset.readyState = "ready-rock";
          p2played.hidden = false;
        }
        p2played.style.transform = "scaleX(-1)";
        p2played.classList.add("shaking-animation-p2");
      }
    }, 4000);
  }, 1000);
}

// shortcut to skip to mainscreen
let keyCount = 0;
const targetKey = "`";
const triggerCount = 3;

document.addEventListener("keydown", (event) => {
  if (event.key === targetKey) {
    keyCount++;
    if (keyCount >= triggerCount) {
      startGame();
      startRound();
    }
  }
});

let keyCount2 = 0;
const targetKey2 = ",";

document.addEventListener("keydown", (event) => {
  if (event.key === targetKey2) {
    keyCount2++;
    if (keyCount2 >= triggerCount) {
      
    }
    console.log("Total numOfWinsP1 is " + numOfWinsP1);
  }
});

// ideally this shouldn't have innerHTML
function saveUserInput() {
  let userInput = document.getElementById("name-input").value.trim();

  if (userInput !== "") {
    if (userInput.length >= 30) {
      userInput = userInput.slice(0, 30) + "...";
    }
    savedPlayer1Name = userInput;
    document.getElementById("chatbox").style.display = "none"; // hide image
    document.getElementById(
      "chatbox-wrapper"
    ).innerHTML = `<h1 id="player1name">${userInput}</h1>
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

document.getElementById("start-game").addEventListener("click", () => {
  saveUserInput();
});

document
  .getElementById("name-input")
  .addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      saveUserInput();
    }
  });

document.getElementById("skip-btn").addEventListener("click", () => {
  loadGame();
});

//come up with a username for p2
// const usernamePartOne = ["ominous", "demure", "verdant", "resolute", "zesty", "eerie", "perky", "opulent"];
// const usernamePartTwo = ["bird", "dog", "cat", "chicken", "pig", "mongoose", "worm"];

const username = [
  "ialwayspickpaper",
  "BlazeIt420",
  "b00baLuver69",
  "stinkyUwU",
  "sigmafreud",
  "norman",
  "bigchVngus",
];

//const player2name = usernamePartOne[getRandomIntInclusive(0,usernamePartOne.length - 1)] + usernamePartTwo[getRandomIntInclusive(0,usernamePartTwo.length - 1)] + getRandomIntInclusive(0,9) + getRandomIntInclusive(0,9) + getRandomIntInclusive(0,9);

const player2name = username[getRandomIntInclusive(0, username.length - 1)];

document.getElementById("player2name").innerText = player2name;

// enables start-game button if user inputs their name
document.getElementById("name-input").addEventListener("input", () => {
  if (document.getElementById("name-input").value.trim() !== "") {
    document.getElementById("start-game").removeAttribute("disabled");
  } else {
    document.getElementById("start-game").setAttribute("disabled", "");
  }
});

document.getElementById("start-game").addEventListener("click", loadGame);
document.getElementById("name-input").addEventListener("keydown", (key) => {
  if (
    key.key === "Enter" &&
    document.getElementById("name-input").value.trim() !== ""
  ) {
      loadGame();
  }
});

// for the timer
const FULL_DASH_ARRAY = 283;
const WARNING_THRESHOLD = 9;
const ALERT_THRESHOLD = 3;

const COLOR_CODES = {
  info: {
    color: "green",
  },
  warning: {
    color: "orange",
    threshold: WARNING_THRESHOLD,
  },
  alert: {
    color: "red",
    threshold: ALERT_THRESHOLD,
  },
};

const TIME_LIMIT = 20;
let timePassed = 0;
let timeLeft = TIME_LIMIT;
let timerInterval = null;
let remainingPathColor = COLOR_CODES.info.color;

// sets the timer to the green circle counting down
function resetTimer() {
  timePassed = 0;
  timeLeft = TIME_LIMIT;
  clearInterval(timerInterval);

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
}
// resetTimer();

function onTimesUp() {
  clearInterval(timerInterval);
}

function startTimer() {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    const label = document.getElementById("base-timer-label");

    // if the label no longer exists, stop everything
    if (!label) {
      clearInterval(timerInterval);
      return;
    }

    timePassed = timePassed += 1;
    timeLeft = TIME_LIMIT - timePassed;
    document.getElementById("base-timer-label").innerHTML =
      formatTime(timeLeft);
    setCircleDasharray();
    setRemainingPathColor(timeLeft);

    if (timeLeft === 0) {
      // if no button is selected, default to rock
      if (
        [...document.querySelectorAll("#p1-buttons button")].every(
          (btn) => !btn.classList.contains("active")
        )
      ) {
        document
          .querySelector("#p1-buttons button.rock")
          .classList.add("active");
  setP1Selection('rock');
        // document.querySelector("#played-hand img.rock").style.visibility = "";
        player1hand = "rock";
        changeTimer();
      }
      hideElement("arrow-guide");
      continueRound();
      onTimesUp();
      // setTimeout(() => removeElement("timer"), 500);
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

player1ButtonClick();

const selectSVG = id => {
  const el = document.getElementById(id);
  if (!el) {
    // console.warn(`SVG with id="${id}" not found yet`);
    return { 
      set: ()=>{}, 
      style: ()=>{}, 
      element: null 
    };
  }
  return new SVGElement(el);
};

const createSVG = type => {
  const el = document.createElementNS('http://www.w3.org/2000/svg', type);
  return new SVGElement(el);
};

class SVGElement {
  constructor(element) {
    this.element = element;
  }

  set(attributeName, value) {
    this.element.setAttribute(attributeName, value);
  }

  style(property, value) {
    this.element.style[property] = value;
  }
}

const colors = [
  { main: '#FBDB4A', shades: ['#FAE073', '#FCE790', '#FADD65', '#E4C650'] },
  { main: '#F3934A', shades: ['#F7B989', '#F9CDAA', '#DD8644', '#F39C59'] },
  { main: '#EB547D', shades: ['#EE7293', '#F191AB', '#D64D72', '#C04567'] },
  { main: '#9F6AA7', shades: ['#B084B6', '#C19FC7', '#916198', '#82588A'] },
  { main: '#5476B3', shades: ['#6382B9', '#829BC7', '#4D6CA3', '#3E5782'] },
  { main: '#2BB19B', shades: ['#4DBFAD', '#73CDBF', '#27A18D', '#1F8171'] },
  { main: '#70B984', shades: ['#7FBE90', '#98CBA6', '#68A87A', '#5E976E'] }
];
// const svg = selectSVG('winner-svg');
// const text = document.getElementById('text');
// const offscreenText = document.getElementById('offscreen-text');
let width = window.innerWidth;
let height = window.innerHeight;
let textSize = 0;
let textCenter = 0;
const letters = [];
const prompt = ['s', 't', 'a', 'r', 't', ' ', 't', 'y', 'p', 'i', 'n', 'g'];
let runPrompt = true;

const resizePage = () => {
  width = window.innerWidth;
  height = window.innerHeight;
  svg.set('height', height);
  svg.set('width', width);
  svg.set('viewBox', `0 0 ${width} ${height}`);
  resizeLetters();
}

const resizeLetters = (text, lettersArr) => {
  let textSize = window.innerWidth / (lettersArr.length + 2);
  if (textSize > 100) textSize = 100;
  text.style.fontSize = `${textSize}px`;
  text.style.lineHeight = `${textSize}px`;
};

const positionLetters = (text, offscreenText, svg) => {
  const containerRect = text.getBoundingClientRect();
  letters.forEach(letter => {
    const rect = letter.offScreen?.getBoundingClientRect();
    if (!rect) return;

    const xPos = rect.left - containerRect.left;
    const timing = letter.shift ? 0.1 : 0;
    TweenLite.to(letter.onScreen, timing, {
      x: xPos + 'px',
      ease: Power3.easeInOut
    });
    letter.shift = true;
  });
};

const animateLetterIn = (letter, i) => {
  const delay = i * 0.1;
  const rotation = -50 + Math.random() * 100;
  const yOffset = (0.5 + Math.random() * 0.5) * 40;

  TweenLite.fromTo(letter, 0.6,
    { scale: 0, opacity: 0, rotation: rotation, y: -yOffset },
    { scale: 1, opacity: 1, rotation: 0, y: 0, ease: Back.easeOut, delay: delay }
  );
};

const addDecor = (letter, color, svg) => {
  setTimeout(() => {
    const x0 = letter.offsetLeft + letter.offsetWidth / 2;
    const y0 = textCenter - textSize * 0.5;
    const shade = color.shades[Math.floor(Math.random() * 4)];
    for (let i = 0; i < 8; i++) addTri(x0, y0, shade, svg);
    for (let i = 0; i < 8; i++) addCirc(x0, y0, svg);
  }, 150);
};

const addTri = (x0, y0, shade, svg) => {
  const tri = createSVG('polygon');
  const a = Math.random();
  const a2 = a + (-0.2 + Math.random()*0.4);
  const r = textSize*0.52;
  const r2 = r + textSize*Math.random()*0.2;
  const x = x0 + r * Math.cos(2 * Math.PI * a);
  const y = y0 + r * Math.sin(2 * Math.PI * a);
  const x2 = x0 + r2 * Math.cos(2 * Math.PI * a2);
  const y2 = y0 + r2 * Math.sin(2 * Math.PI * a2);
  const triSize = textSize * 0.1;
  const scale = 0.3 + Math.random()*0.7;
  const offset = triSize*scale;
  tri.set('points', `0,0 ${triSize*2},0 ${triSize},${triSize*2}`);
  tri.style('fill', shade);
  svg.element.appendChild(tri.element);
  TweenLite.fromTo(tri.element, 0.6, 
    { rotation: Math.random()*360, scale: scale, x: x-offset, y: y-offset, opacity: 1 },
    { x: x2-offset, y: y2-offset, opacity: 0, ease: Power1.easeInOut, 
      onComplete: () => { svg.element.removeChild(tri.element); } }
  );
}

const addCirc = (x0, y0, svg) => {
  const circ = createSVG('circle');
  const a = Math.random();
  const r = textSize*0.52;
  const r2 = r + textSize;
  const x = x0 + r * Math.cos(2 * Math.PI * a);
  const y = y0 + r * Math.sin(2 * Math.PI * a);
  const x2 = x0 + r2 * Math.cos(2 * Math.PI * a);
  const y2 = y0 + r2 * Math.sin(2 * Math.PI * a);
  const circSize = textSize * 0.05 * Math.random();
  circ.set('r', circSize);
  circ.style('fill', '#eee');
  svg.element.appendChild(circ.element);
  TweenLite.fromTo(circ.element, 0.6, 
    { x: x-circSize, y: y-circSize, opacity: 1 },
    { x: x2-circSize, y: y2-circSize, opacity: 0, ease: Power1.easeInOut, 
      onComplete: () => { svg.element.removeChild(circ.element); } }
  );
}

const addLetter = (char, i, text, svg, lettersArr) => {
  const letter = document.createElement('span');
  letter.innerHTML = char;
  text.appendChild(letter);

  const color = colors[i % colors.length];
  letter.style.color = color.main;

  lettersArr[i] = { onScreen: letter, char: char };

  animateLetterIn(letter, i);   // still works
  addDecor(letter, color, svg);
};

const addLetters = (value, text, offscreenText, svg, lettersArr) => {
  value.forEach((char, i) => {
    if (lettersArr[i] && lettersArr[i].char !== char) {
      lettersArr[i].onScreen.innerHTML = char;
      if (lettersArr[i].offScreen) lettersArr[i].offScreen.innerHTML = char;
      lettersArr[i].char = char;
    }
    if (lettersArr[i] === undefined) {
      addLetter(char, i, text, svg, lettersArr);
    }
  });
};

const animateLetterOut = (letter, i, text, offscreenText, lettersArr) => {
  TweenLite.to(letter.onScreen, 0.1, {
    scale: 0,
    opacity: 0,
    ease: Power2.easeIn,
    onComplete: () => {
      if (letter.offScreen) offscreenText.removeChild(letter.offScreen);
      if (letter.onScreen) text.removeChild(letter.onScreen);
    }
  });
  lettersArr.splice(i, 1);
};

const removeLetters = (value, text, offscreenText, lettersArr) => {
  for (let i = lettersArr.length - 1; i >= 0; i--) {
    const letter = lettersArr[i];
    if (value[i] === undefined) {
      animateLetterOut(letter, i, text, offscreenText, lettersArr);
    }
  }
};