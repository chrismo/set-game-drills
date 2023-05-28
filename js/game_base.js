export class GameBase {
  document;
  fills;
  shapes;
  colors;
  numbers;
  cards = [];

  constructor(document) {
    this.document = document;
    // The order matters here, so the results align with the image indexes at
    // the host site.
    this.fills = ["solid", "striped", "clear"];
    this.shapes = ["squiggle", "diamond", "pill"];
    this.colors = ["red", "purple", "green"];
    this.numbers = [1, 2, 3];

    this.generateCards();
  }

  generateCards() {
    let cardIndex = 0;

    // The order matters here, so the results align with the image indexes at
    // the host site.
    this.fills.forEach(fill => this.shapes.forEach(shape => this.colors.forEach(color => this.numbers.forEach(number => {
      this.cards[cardIndex] = {
        imgIndex: cardIndex + 1,
        fill: fill,
        shape: shape,
        color: color,
        number: number
      };
      cardIndex++;
    }))));
  }

  // min..max inclusive
  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  randomUniqNumbers(min, max, length) {
    let result = [];
    let rand;
    while (result.length < length) {
      rand = this.getRandomInt(min, max);
      if (result.indexOf(rand) === -1) result.push(rand);
    }
    return result;
  }

  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  randomTupleIndexes() {
    return this.randomUniqNumbers(0, 80, 3);
  }

  tupleIsSet(tuple) {
    // I'm sure there's a slicker way to do this, but this works
    let result = {
      fills: [],
      colors: [],
      shapes: [],
      numbers: []
    };

    tuple.forEach(card => {
      if (result.fills.indexOf(card.fill) === -1) result.fills.push(card.fill);
      if (result.colors.indexOf(card.color) === -1) result.colors.push(card.color);
      if (result.shapes.indexOf(card.shape) === -1) result.shapes.push(card.shape);
      if (result.numbers.indexOf(card.number) === -1) result.numbers.push(card.number);
    });

    // all attributes should be the same (length == 1) or different (length == 3)
    return !((result.fills.length === 2) || (result.colors.length === 2) || (result.shapes.length === 2) || (result.numbers.length === 2));
  }

  makeSet(cardA = undefined, cardB = undefined) {
    // method already ensures no duplicates
    let indexes = this.randomTupleIndexes(), cardC;

    cardA ||= this.cards[indexes[0]];
    cardB ||= this.cards[indexes[1]];
    cardC = {
      fill: "",
      shape: "",
      color: "",
      number: 0
    };

    for (const [key, value] of Object.entries({
      fill: this.fills,
      color: this.colors,
      shape: this.shapes,
      number: this.numbers,
    })) {
      if (cardA[key] !== cardB[key]) {
        cardC[key] = this.unusedElement(value, cardA[key], cardB[key]);
      } else {
        cardC[key] = cardA[key];
      }
    }

    for (const [_, card] of Object.entries(this.cards)) {
      if ((card.fill === cardC.fill) && (card.shape === cardC.shape) && (card.color === cardC.color) && (card.number === cardC.number)) {
        cardC = card;
      }
    }

    return [cardA, cardB, cardC];
  }

  unusedElement(ary, valueA, valueB) {
    return ary.filter(value => value !== valueA && value !== valueB)[0];
  }

  renderTuple(tuple, parent, cssClass = "") {
    tuple.forEach(card => {
      let img = this.document.createElement("img"), plural;
      img.src = `https://www.setgame.com/sites/all/modules/setgame_set/assets/images/new/${card.imgIndex}.png`;
      img.className = cssClass;
      plural = card.number === 1 ? '' : 's';
      let cardDescription = `${card.number} ${card.color} ${card.fill} ${card.shape}${plural}`;
      img.alt = cardDescription;
      img.title = cardDescription;
      parent.appendChild(img);
    });
  }

  sortedTuple(a, b, c) {
    return [a, b, c].sort((x, y) => {
      if (x.imgIndex < y.imgIndex) return -1;
      if (x.imgIndex > y.imgIndex) return 1;
      return 0;
    })
  }

  tupleInArray(tuple, array) {
    let tupleIdx = tuple.map(card => card.imgIndex).sort();
    let tupleFound = false;
    array.forEach(arrayTuple => {
      let arrayTupleIdx = arrayTuple.map(card => card.imgIndex).sort();

      if (JSON.stringify(tupleIdx) === JSON.stringify(arrayTupleIdx)) {
        tupleFound = true;
      }
    });
    return tupleFound;
  }
}

export class Card {
  constructor(imgIndex, fill, shape, color, number) {
    this.imgIndex = imgIndex;
    this.fill = fill;
    this.shape = shape;
    this.color = color;
    this.number = number;
  }
}

export class Tuple {
  constructor(cardA, cardB, cardC) {
    // sort for easy comparison
  }
}
