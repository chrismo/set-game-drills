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

    // while (this.cards.length < 12) {
    //   let seedCardA, seedCardB;
    //   if (this.cards.length > 0) {
    //     let indexes = this.base.randomUniqNumbers(0, this.cards.length - 1, 2);
    //     seedCardA = this.cards[indexes[0]];
    //     seedCardB = this.cards[indexes[1]];
    //   }
    //   let set = this.base.makeSet(seedCardA, seedCardB);
    //   this.found.push(set);
    //
    //   let sliceIdx = (seedCardA === undefined) ? 0 : 2;
    //   this.cards.push(...set.slice(sliceIdx));
    // }
  }

  setupCards() {
    this.base.shuffleCards();
    let deckIndex = 4;
    let seedCards = this.base.cards.slice(0, deckIndex);

    let setA = this.base.makeSet(seedCards[0], seedCards[1]);
    let setB = this.base.makeSet(seedCards[2], seedCards[3]);
    setA.map(card => this.pushIfLegal(card));
    setB.map(card => this.pushIfLegal(card));

    // this usually yields 6 sets, but sometimes fewer due to overlap.
    // oy - this is ugly
    let enoughSets = false;
    let enoughCards = false;
    while (!enoughSets || !enoughCards) {
      this.cards.forEach(cardA => {
        if (enoughSets) return;
        this.cards.forEach(cardB => {
          if (enoughSets) return;
          if (cardA === cardB) return;

          let newSet = this.base.makeSet(cardA, cardB);
          this.pushIfLegal(newSet[2]);

          if (this.solve().length > 6) {
            console.log("removing last card, too many sets");
            this.cards = this.cards.slice(0, -2);
          }

          if (this.solve().length === 6) {
            console.log("6 sets reached");
            enoughSets = true;
          }
        })
      });

      if (!enoughCards) {
        let pushed = false;
        while (!pushed) {
          let newCard = this.base.cards.slice(deckIndex, ++deckIndex)[0];
          if (deckIndex > this.base.cards.length - 1) throw "out of cards"
          pushed = this.pushIfLegal(newCard);
          console.log(`new card pushed: ${pushed} deckIndex: ${deckIndex}`);
          console.log(newCard);
        }
      }

      if (this.solve().length === 6) {
        console.log("6 sets reached");
        enoughSets = true;
      }

      if (this.cards.length === 12) {
        console.log("12 cards reached");
        enoughCards = true;
      }
    }

    this.found = new Solver(this.base, this.cards).found;
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
      if (foundSets.length <= 6) {
        this.cards.push(card);
        return true;
      } else {
        console.log("card not pushed: would create too many sets");
      }
    } else {
      // console.log("card not pushed: already added");
    }
    return false;
  }

  solve() {
    return new Solver(this.base, this.cards).found;
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
