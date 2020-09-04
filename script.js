class Model {
  constructor() {
    this.rowLength = 6;
    this.rows = 6;
    this.numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    this.numberContainers = [];
    this.timeout = 3;
    this.intervalId = null;
    this.timerIntervalId = null;
    this.currentTarget = 0;
    this.currentSum = 0;
    this.score = 0;
  }
  clearTimerInterval = () => {
    clearInterval(this.timerIntervalId);
  };
  setupTimer = () => {
    this.timerStarter();
    this.timeElapsed = 0;
    this.timerIntervalId = setInterval(() => {
      this.timerUpdater(this.timeElapsed);
      this.timeElapsed += 0.13;
    }, this.timeout);
  };
  addRow = () => {
    let newRow = [];
    for (let i = 0; i < this.rowLength; i++) {
      newRow.push(this.numberContainerCreator());
    }
    this.numberContainers = newRow.concat(this.numberContainers);
    if (this.numberContainers.length > this.rowLength * this.rows) {
      this.gameOver();
    } else {
      this.updateGridHandler(this.numberContainers);
      this.setupTimer();
    }
  };
  startGame = () => {
    this.score = 0;
    this.numberContainers = [];
    this.updateGridHandler(this.numberContainers);
    this.resetTarget();
    this.clearTimerInterval();
    this.addRow();
    this.intervalId = setInterval(() => {
      this.clearTimerInterval();
      this.addRow();
    }, this.timeout * 1000);
  };
  gameOver = () => {
    clearInterval(this.timerIntervalId);
    clearInterval(this.intervalId);
    this.timerStarter();
    this.resultShower(this.score);
  };
  resetTarget = () => {
    this.currentTarget = Math.round(Math.random() * 60);
    this.currentSum = 0;
    this.removeSelectedNumberContainers();
    this.updateCurrentSumHandler(this.currentSum);
    this.updateTargetHandler(this.currentTarget);
  };
  removeSelectedNumberContainers = () => {
    let numbers = [];
    let s = 0;
    this.numberContainers.forEach((numC) => {
      if (numC.getAttribute("selected")) {
        s++;
      } else {
        numbers.push(numC);
      }
    });
    this.score += s;
    this.scoreUpdater(this.score);
    this.numberContainers = numbers;
    this.updateGridHandler(this.numberContainers);
  };
  onNumberSelected = (number) => {
    this.currentSum += number;
    if (this.currentSum < this.currentTarget) {
      this.updateCurrentSumHandler(this.currentSum);
      return true;
    }
    if (this.currentSum > this.currentTarget) {
      this.currentSum -= number;
      this.updateCurrentSumHandler(this.currentSum);
      return false;
    }
    if (this.currentSum === this.currentTarget) {
      this.resetTarget();
      return false;
    }
  };
  bindUpdateTargetHandler = (handler) => {
    this.updateTargetHandler = handler;
  };
  bindUpdateCurrentSumHandler = (handler) => {
    this.updateCurrentSumHandler = handler;
  };
  bindUpdateGridHandler = (handler) => {
    this.updateGridHandler = handler;
  };
  bindNumberContainerCreator = (creator) => {
    this.numberContainerCreator = creator;
  };
  bindTimerUpdater = (updater) => {
    this.timerUpdater = updater;
  };
  bindTimerStarter = (starter) => {
    this.timerStarter = starter;
  };
  bindScoreUpdater = (updater) => {
    this.scoreUpdater = updater;
  };
  bindResultShower = (shower) => {
    this.resultShower = shower;
  };
}

class View {
  constructor() {
    this.gridSize = 6;
    this.grid = document.getElementById("grid");
    this.targetContainer = document.getElementById("target");
    this.currentSumContainer = document.getElementById("currentSum");
    this.scoreContainer = document.getElementById("score");
    this.timerDiv = document.getElementById("timer");
    this.modalContainer = document.getElementById("modalContainer");
    this.modalContent = document.getElementById("modalContent");
    this.modalCloseButton = document.getElementById("modalCloseButton");
    this.init();
  }
  init = () => {
    this.drawGrid();
    this.showStartScreen();
  };
  drawGrid = () => {
    for (let i = 1; i <= this.gridSize; i++) {
      let row = document.createElement("div");
      row.className = "row";
      for (let j = 1; j <= this.gridSize; j++) {
        let cell = document.createElement("div");
        cell.className = "cell";
        row.appendChild(cell);
      }
      this.grid.appendChild(row);
    }
  };
  showStartScreen = () => {
    this.modalContainer.style.display = "flex";
    this.modalContent.innerHTML = "";
    let heading = document.createElement("h1");
    heading.innerText = `Welcome to Math-Clash`;
    heading.style.color = "red";
    this.modalContent.appendChild(heading);
    this.modalCloseButton.innerText = "Start Game";
    this.modalCloseButton.addEventListener("click", () => {
      this.modalContainer.style.display = "none";
      this.gameStarter();
    });
  };
  bindGameStarter = (starter) => {
    this.gameStarter = starter;
  };
  showResult = (score) => {
    this.modalContainer.style.display = "flex";
    this.modalContent.innerHTML = "";
    let heading = document.createElement("h1");
    heading.innerText = `Your Score : ${score}`;
    this.modalContent.appendChild(heading);
    this.modalCloseButton.innerText = "New Game";
  };
  handleNumberSelected = (event) => {
    event.stopPropagation();
    let selectedContainer = event.target;
    let select = this.numberContainerSelectionHandler(
      Number(selectedContainer.innerHTML.trim())
    );
    if (select) {
      selectedContainer.className = "selectedNumberContainer";
      selectedContainer.classList.add("center");
      selectedContainer.setAttribute("selected", "true");
    }
  };
  createNumberContainer = () => {
    let div = document.createElement("div");
    div.classList.add("numberContainer");
    div.classList.add("center");
    div.innerHTML = String(Math.round(8 * Math.random()) + 1);
    div.onclick = this.handleNumberSelected;
    return div;
  };
  updateGrid = (numberContainers) => {
    let numbers = numberContainers.length;
    let index = 0;
    this.grid.childNodes.forEach((row) => {
      row.childNodes.forEach((cell) => {
        cell.innerHTML = "";
        if (index < numbers) {
          cell.appendChild(numberContainers[index]);
          index++;
        }
      });
    });
  };
  updateScore = (score) => {
    this.scoreContainer.innerText = `Score : ${score}`;
  };
  updateTarget = (target) => {
    this.targetContainer.innerHTML = target;
  };
  updateCurrentSum = (currentSum) => {
    this.currentSumContainer.innerHTML = currentSum;
  };
  startTimer = () => {
    this.timerDiv.style.width = "97%";
  };
  updateTimer = (percentage) => {
    this.timerDiv.style.width = `calc(97% - ${percentage}%)`;
  };
  bindNumberContainerSelectionHandler = (handler) => {
    this.numberContainerSelectionHandler = handler;
  };
}
class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.model.bindUpdateGridHandler(this.view.updateGrid);
    this.model.bindUpdateCurrentSumHandler(this.view.updateCurrentSum);
    this.model.bindUpdateTargetHandler(this.view.updateTarget);
    this.model.bindNumberContainerCreator(this.view.createNumberContainer);
    this.model.bindTimerUpdater(this.view.updateTimer);
    this.model.bindTimerStarter(this.view.startTimer);
    this.model.bindScoreUpdater(this.view.updateScore);
    this.model.bindResultShower(this.view.showResult);
    this.view.bindNumberContainerSelectionHandler(this.model.onNumberSelected);
    this.view.bindGameStarter(this.model.startGame);
  }
}
window.onload = () => {
  new Controller(new Model(), new View());
};
