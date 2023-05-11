export class Practice {
  currentTuple = [];

  constructor(base) {
    this.base = base;
    this.ui = base.document;

    this.setupUI();
    this.loadNewTuple();
  }

  setupUI() {
    this.ui.querySelector('input#yes').addEventListener('click', this.yes);
    this.ui.querySelector('input#no').addEventListener('click', this.no);

    this.ui.addEventListener('keypress', (event) => {
      switch (event.key) {
        case "y":
          this.yes();
          break;
        case "n":
          this.no();
          break;
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
    this.ui.querySelector("span#right").hidden = true;
    this.ui.querySelector("span#wrong").hidden = false;
  }

  right() {
    this.ui.querySelector("span#right").hidden = false;
    this.ui.querySelector("span#wrong").hidden = true;
    this.loadNewTuple();
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

    this.renderTuple(div);
  }

  renderTuple(div) {
    this.currentTuple.forEach(card => {
      let img = this.ui.createElement("img"), plural;
      img.src = `https://www.setgame.com/sites/all/modules/setgame_set/assets/images/new/${card.imgIndex}.png`;
      plural = card.number === 1 ? '' : 's';
      let cardDescription = `${card.number} ${card.color} ${card.fill} ${card.shape}${plural}`;
      img.alt = cardDescription;
      img.title = cardDescription;
      div.appendChild(img);
    });
  }
}
