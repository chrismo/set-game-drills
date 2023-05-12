import {Practice} from "./practice.js";

export class Fast30 {
  constructor(base) {
    this.base = base;
    this.ui = base.document.querySelector('div#board');
    this.practice = new Practice(base);
    this.practice.autoNextTupleOnRight = false;

    this.history = [];
    this.numberRight = 0;
    this.numberWrong = 0;
    this.totalGuesses = 30;

    this.setupUI();
    this.setupEvents();
    this.startGame();
  }

  setupUI() {
    let divResult = this.ui.querySelector('div#result');
    while (divResult.firstChild) {
      divResult.removeChild(divResult.firstChild);
    }

    let score = this.base.document.createElement("div");
    score.id = "score";
    score.className = "result";
    divResult.appendChild(score);

    let rightScore = this.base.document.createElement("span");
    rightScore.id = 'rightScore';
    score.appendChild(rightScore);

    let wrongScore = this.base.document.createElement("span");
    wrongScore.id = 'wrongScore';
    wrongScore.className = 'padLeft';
    score.appendChild(wrongScore);

    let timer = this.base.document.createElement("span");

    timer.id = "timer";
    timer.className = "result padLeft";
    timer.innerHTML = "0:00";
    score.appendChild(timer);

    let history = this.base.document.createElement("div");
    history.id = "history";
    this.ui.appendChild(history);
  }

  updateUI() {
    // add timer
    let timer = this.ui.querySelector('#timer');
    timer.innerHTML = this.formattedDuration();

    // add score
    let rightSpan = `<span style="color: green">&#x2713; ${this.numberRight}</span>`;
    let wrongSpan = `<span style="color: red">X ${this.numberWrong}</span>`;
    this.ui.querySelector('#rightScore').innerHTML = rightSpan;
    this.ui.querySelector('#wrongScore').innerHTML = wrongSpan;

    let historyDiv = this.ui.querySelector('div#history');
    while (historyDiv.firstChild) {
      historyDiv.removeChild(historyDiv.firstChild);
    }
    this.history.slice().reverse().forEach(guess => {
      let guessSpan = this.base.document.createElement('span');
      this.base.renderTuple(guess.tuple, guessSpan, "smallCard");

      let answerSpan = this.base.document.createElement('span');
      if (guess.correctAnswer) {
        answerSpan.innerHTML = `<span style="color: green">&#x2713;</span>`;
      } else {
        answerSpan.innerHTML = `<span style="color: red">X</span>`;
      }
      guessSpan.appendChild(answerSpan);
      guessSpan.appendChild(this.base.document.createElement('br'));
      historyDiv.appendChild(guessSpan);
    });
  }

  formattedDuration() {
    let date = new Date(0);
    date.setMilliseconds(Date.now() - this.startTime);
    return date.toISOString().substring(14, 19);
  }

  setupEvents() {
    this.practice.addEventListener('right', (e) => {
      this.right();
    });
    this.practice.addEventListener('wrong', (e) => {
      this.wrong();
    });
  }

  startGame() {
    this.startTime = Date.now();
    // start timeout for endGame

    this.practice.loadNewTuple();
    this.updateUI();
  }

  endGame() {
    // stop usual inputs
    this.practice.gameIsActive = false;

    let inputElement = this.ui.querySelector('#inputs');
    while (inputElement.firstChild) {
      inputElement.removeChild(inputElement.firstChild);
    }

    inputElement.innerHTML = `${this.numberRight} correct and ${this.numberWrong} wrong in ${this.formattedDuration()}<br/>Refresh the page to play again!`;
  }

  right() {
    this.numberRight++;
    this.appendHistory(true);
    this.updateUI();
    this.endGuess();
  }

  wrong() {
    this.numberWrong++;
    this.appendHistory(false);
    this.updateUI();
    this.endGuess();
  }

  endGuess() {
    let totalGuesses = this.numberRight + this.numberWrong;
    if (totalGuesses < this.totalGuesses) {
      this.practice.loadNewTuple();
    } else {
      this.endGame();
    }
  }

  appendHistory(correctAnswer) {
    let guess = new TupleGuess(this.practice.currentTuple, correctAnswer);
    this.history.push(guess);
  }
}

class TupleGuess {
  tuple;
  correctAnswer = false;

  constructor(tuple, correctAnswer) {
    this.tuple = tuple.map((x) => x); // duplicate it
    this.correctAnswer = correctAnswer;
  }
}