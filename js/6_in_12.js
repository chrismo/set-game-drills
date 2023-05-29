// TODO:
// - mobile - make sure 6 found all fit on screen
//   - minimum two wide - cuz one wide is too big
//   - don't allow on big screen to go 4 wide
//   - big screen, board pushes solved off the bottom

// - pause and stop to give up

export class SixInTwelve {
  constructor(base) {
    this.base = base;
    this.ui = base.document.querySelector('div#board');

    this.board = new Board(this.base);
    this.board.setup();

    this.found = [];
  }

  startGame() {
    this.setupEvents();

    this.gameIsActive = true;
    this.enableTimer = true;
    this.startTime = Date.now();
    this.startTimer();
    this.initUI();
    if (this.enableTimer) this.updateTimer();
  }

  setupEvents() {
    this.ui.querySelector('#pause').addEventListener('click', (e) => {
    });
    this.ui.querySelector('#stop').addEventListener('click', (e) => {
      // TODO: fill in missing ones, otherwise the
      // order of found ones doesn't stay
      this.found = this.board.found;
      this.startTime = Date.now() + 2;
      this.endGame();
      this.updateUI();
    });
  }

  startTimer() {
    setTimeout(() => {
      this.updateTimer();
      if (this.gameIsActive) {
        this.startTimer();
      }
    }, 500);
  }

  updateTimer() {
    let timer = this.ui.querySelector('#timer');
    timer.innerHTML = this.formattedDuration();
  }

  formattedDuration() {
    let date = new Date(0);
    date.setMilliseconds(Date.now() - this.startTime);
    return date.toISOString().substring(14, 19);
  }

  initUI() {
    let parent = this.ui.querySelector('div#cards');
    this.board.cards.forEach(card => {
      let img = this.base.document.createElement("img"), plural;
      img.src = `https://www.setgame.com/sites/all/modules/setgame_set/assets/images/new/${card.imgIndex}.png`;
      img.className = 'col-3 border rounded-3';
      img.dataset.selected = "false";
      img.dataset.imgIndex = card.imgIndex;
      img.addEventListener('click', (event) => {
        if (this.gameIsActive) {
          this.resetAllDangerSelections();
          img.dataset.selected = img.dataset.selected === "false" ? "true" : "false";
          if (img.dataset.selected === "true") {
            img.classList.remove("bg-danger");
            img.classList.add("bg-primary");
            img.classList.add("bg-gradient");
          } else {
            img.classList.remove("bg-primary");
            img.classList.remove("bg-gradient");
          }
          this.updateGame();
        }
      });

      parent.appendChild(img);
    });
  }

  updateGame() {
    let selected = this.ui.querySelectorAll('img.bg-primary');
    if (selected.length === 3) {
      let guess = Array.from(selected).map(element =>
        this.base.cards[parseInt(element.dataset.imgIndex) - 1]
      )
      this.resetAllSelections();
      if (this.base.tupleIsSet(guess)) {
        if (!this.base.tupleInArray(guess, this.found)) {
          this.found.push(guess);
          if (this.found.length === this.board.found.length) {
            this.endGame();
          }
        } else {
          // TODO: highlight already found
        }
      } else {
        Array.from(selected).forEach(e => e.classList.add("bg-danger"));
      }
    }
    this.updateUI();
  }

  resetAllSelections() {
    let cards = this.ui.querySelectorAll('#cards img');

    Array.from(cards).forEach(
      e => {
        e.classList.remove("bg-primary");
        e.classList.remove("bg-danger");
        e.dataset.selected = "false";
      });
  }

  resetAllDangerSelections() {
    let cards = this.ui.querySelectorAll('#cards img.bg-danger');
    Array.from(cards).forEach(e => {
      e.classList.remove("bg-danger");
      e.dataset.selected = "false";
    })
  }

  updateUI() {
    let foundDiv = this.ui.querySelector('div#history');
    while (foundDiv.firstChild) {
      foundDiv.removeChild(foundDiv.firstChild);
    }
    this.found.slice().reverse().forEach(set => {
      let setSpan = this.base.document.createElement('span');
      setSpan.className = 'border rounded-3 col-6';
      setSpan.id = 'guess';
      setSpan.style.backgroundColor = "#ddffee";
      setSpan.addEventListener('mouseover', (event) => {
        let imgIndexes = set.map(c => c.imgIndex);
        imgIndexes.forEach(idx => {
          let e = this.ui.querySelector(`[data-img-index="${idx}"]`)
          e.classList.add("bg-primary");
        })
      })
      setSpan.addEventListener('mouseout', (event) => {
        this.resetAllSelections()
      })

      let cardsRow = this.base.document.createElement('div');
      cardsRow.className = 'row gx-4';

      this.base.renderTuple(set, cardsRow, 'col-4 historyImg');
      setSpan.appendChild(cardsRow);

      foundDiv.appendChild(setSpan);
    });
  }

  endGame() {
    this.gameIsActive = false;
  }
}

class Board {
  constructor(base) {
    this.base = base;
    this.cards = [];
    this.found = [];
  }

  setup() {
    this.setupCards();
    this.base.shuffleArray(this.cards);
  }

  setupCardsAtLeast6() {
    // Always 12 cards, AT LEAST 6 sets, no scanning for non-set cards.

    let seedCards = this.base.randomUniqNumbers(1, 81, 6)
      .map(idx => this.cards[idx]);

    this.cards.push(...this.base.makeSet(seedCards[0], seedCards[1]));
    this.cards.push(...this.base.makeSet(seedCards[2], seedCards[3]));

    this.cards.push(this.base.makeSet(this.cards[0], this.cards[3])[2]);
    this.cards.push(this.base.makeSet(this.cards[1], this.cards[4])[2]);
    this.cards.push(this.base.makeSet(this.cards[2], this.cards[5])[2]);

    this.cards.push(...this.base.makeSet(seedCards[4], seedCards[5]));
  }

  setupCards() {
    // sets need to be intentionally constructed, they don't happen randomly too often

    let shuffledCards = this.base.cards.map(c => c);
    this.base.shuffleArray(shuffledCards);

    let deckIndex = 4;
    let seedCards = shuffledCards.slice(0, deckIndex);

    let setA = this.base.makeSet(seedCards[0], seedCards[1]);
    let setB = this.base.makeSet(seedCards[2], seedCards[3]);
    setA.map(card => this.pushIfLegal(card));
    setB.map(card => this.pushIfLegal(card));

    // this usually yields 6 sets, but sometimes fewer due to overlap.
    // oy - this is ugly
    while (!this.boardComplete()) {
      this.cards.forEach(cardA => {
        if (this.enoughSets()) return;
        this.cards.forEach(cardB => {
          if (this.enoughSets()) return;
          if (cardA === cardB) return;

          let newSet = this.base.makeSet(cardA, cardB);
          this.pushIfLegal(newSet[2]);
        })
      });

      if (!this.enoughCards()) {
        let pushed = false;
        while (!pushed) {
          let newCard = shuffledCards.slice(deckIndex, ++deckIndex)[0];
          if (deckIndex > shuffledCards.length - 1) throw "out of cards"
          pushed = this.pushIfLegal(newCard);
          console.log(`new card pushed: ${pushed} deckIndex: ${deckIndex}`);
          console.log(newCard);
        }
      }
    }
  }

  boardComplete() {
    return (this.enoughSets() && this.enoughCards());
  }

  enoughSets() {
    return this.found.length === 6;
  }

  enoughCards() {
    return this.cards.length === 12;
  }

  pushIfLegal(card) {
    if (card.imgIndex === undefined) throw `wut: ${card}`;

    let cloneCards = this.cards.map(c => c);

    let cardFound = false;
    cloneCards.forEach(boardCard => {
      if (boardCard.imgIndex === card.imgIndex) cardFound = true;
    })
    if (!cardFound) {
      cloneCards.push(card);
      let foundSets = new Solver(this.base, cloneCards).found
      if ((foundSets.length <= 6) && (cloneCards.length <= 12)) {
        this.cards.push(card);
        console.log(`${this.cards.length} cards`);
        this.setFound(foundSets);
        return true;
      } else {
        console.log("card not pushed: would create too many sets");
      }
    } else {
      // console.log("card not pushed: already added");
    }
    return false;
  }

  setFound(sets) {
    this.found = sets;
    console.log(`${this.found.length} sets`)
  }
}

class Solver {
  constructor(base, cards) {
    this.base = base;
    this.cards = cards;
    this.found = []
    this.solve();
  }

  solve() {
    this.cards.forEach(cardA => {
      this.cards.forEach(cardB => {
        if (cardA === cardB) return;

        this.cards.forEach(cardC => {
          if ((cardA === cardC) || (cardB === cardC)) return;

          let tuple = this.base.sortedTuple(cardA, cardB, cardC);
          if (this.base.tupleIsSet(tuple)) {
            if (!this.base.tupleInArray(tuple, this.found)) {
              this.found.push(tuple);
            }
          }
        })
      })
    });
  }
}
