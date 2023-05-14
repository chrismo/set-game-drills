// Maybe use a node package for events?
export class Practice extends EventTarget {
  currentTuple = [];
  autoNextTupleOnRight = true;
  gameIsActive = true;

  constructor(base) {
    super();
    this.base = base;
    this.ui = base.document;

    this.setupUI();
    this.loadNewTuple();
  }

  setupUI() {
    this.ui.querySelector('input#yes').addEventListener('click', () => this.yes());
    this.ui.querySelector('input#no').addEventListener('click', () => this.no());

    this.ui.addEventListener('keypress', (event) => {
      if (this.gameIsActive) {
        switch (event.key) {
          case "y":
            this.yes();
            break;
          case "n":
            this.no();
            break;
        }
      }
    });
  }

  yes() {
    this.base.tupleIsSet(this.currentTuple) ? this.right() : this.wrong();
  }

  no() {
    this.base.tupleIsSet(this.currentTuple) ? this.wrong() : this.right();
  }

  wrong() {
    // TODO: when practice becomes a choice again to play, fix the score here
    // this.ui.querySelector("span#right").hidden = true;
    // this.ui.querySelector("span#wrong").hidden = false;
    this.dispatchEvent(new Event("wrong"));
  }

  right() {
    // TODO: when practice becomes a choice again to play, fix the score here
    // this.ui.querySelector("span#right").hidden = false;
    // this.ui.querySelector("span#wrong").hidden = true;
    this.dispatchEvent(new Event("right"));
    if (this.autoNextTupleOnRight) {
      this.loadNewTuple();
    }
  }

  loadNewTuple() {
    let div = this.ui.querySelector('#tuple'), indexes;
    while (div.firstChild) {
      div.removeChild(div.firstChild);
    }

    // fully random creates a real set very rarely
    if (this.base.getRandomInt(1, 4) === 1) {
      this.currentTuple = this.base.makeSet();
    } else {
      indexes = this.base.randomTupleIndexes();
      this.currentTuple = indexes.map(cardIndex => this.base.cards[cardIndex]);
    }

    this.base.renderTuple(this.currentTuple, div, "col-4");
  }
}
