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
    this.enableTimer = true;

    this.setupEvents();
  }

  updateUI() {
    if (this.enableTimer) {
      this.updateTimer();
    }

    let rightSpan = `<span style="color: green">&#x2713;&nbsp;${this.numberRight}</span>`;
    let wrongSpan = `<span style="color: red">X&nbsp;${this.numberWrong}</span>`;
    this.ui.querySelector('#rightScore').innerHTML = rightSpan;
    this.ui.querySelector('#wrongScore').innerHTML = wrongSpan;

    let historyDiv = this.ui.querySelector('div#history');
    while (historyDiv.firstChild) {
      historyDiv.removeChild(historyDiv.firstChild);
    }
    this.history.slice(-100).reverse().forEach(guess => {
      let guessSpan = this.base.document.createElement('span');
      guessSpan.className = 'row border rounded-3 p-2';
      guessSpan.id = 'guess';
      guessSpan.style.backgroundColor = guess.correctAnswer ? "#ddffee" : "#ffddee";

      this.base.renderTuple(guess.tuple, guessSpan, 'col-4 historyImg');
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

    if (this.enableTimer) {
      this.startTimer();
    }
  }

  startTimer() {
    setTimeout(() => {
      this.updateTimer();
      if (this.practice.gameIsActive) {
        this.startTimer();
      }
    }, 500);
  }

  updateTimer() {
    let timer = this.ui.querySelector('#timer');
    timer.innerHTML = this.formattedDuration();
  }

  endGame() {
    // stop usual inputs
    this.practice.gameIsActive = false;

    let inputElement = this.ui.querySelector('#inputs');
    while (inputElement.firstChild) {
      inputElement.removeChild(inputElement.firstChild);
    }

    let resultText = this.base.document.createElement('span');
    resultText.className = 'col-12 text-center';
    resultText.innerHTML = `${this.numberRight} correct and ${this.numberWrong} wrong in ${this.formattedDuration()}<br/>Refresh the page to play again!`;
    inputElement.appendChild(resultText);
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
