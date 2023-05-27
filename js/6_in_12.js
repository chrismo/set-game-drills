export class SixInTwelve {
  constructor(base) {
    this.base = base;
    this.ui = base.document.querySelector('div#board');

    this.board = new Board(this.base);

    this.board.setup();
  }


  startGame() {
    this.updateUI();
  }

  updateUI() {
    let parent = this.ui.querySelector('div#cards');
    this.board.cards.forEach(card => {
      let img = this.base.document.createElement("img"), plural;
      img.src = `https://www.setgame.com/sites/all/modules/setgame_set/assets/images/new/${card.imgIndex}.png`;
      img.className = 'col-3';
      plural = card.number === 1 ? '' : 's';
      let cardDescription = `${card.number} ${card.color} ${card.fill} ${card.shape}${plural}`;
      img.alt = cardDescription;
      img.title = cardDescription;
      parent.appendChild(img);
    });

    let foundDiv = this.ui.querySelector('div#history');
    while (foundDiv.firstChild) {
      foundDiv.removeChild(foundDiv.firstChild);
    }
    this.board.found.slice().reverse().forEach(set => {
      let setSpan = this.base.document.createElement('span');
      setSpan.className = 'row border rounded-3 p-2';
      setSpan.id = 'guess';
      setSpan.style.backgroundColor = "#ddffee";

      this.base.renderTuple(set, setSpan, 'col-4 historyImg');
      foundDiv.appendChild(setSpan);
    });
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

    this.base.shuffleCards();
    let deckIndex = 4;
    let seedCards = this.base.cards.slice(0, deckIndex);

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
          let newCard = this.base.cards.slice(deckIndex, ++deckIndex)[0];
          if (deckIndex > this.base.cards.length - 1) throw "out of cards"
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
