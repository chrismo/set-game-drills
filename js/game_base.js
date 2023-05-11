export class GameBase {
  document;
  fills;
  shapes;
  colors;
  numbers;
  cards = [];

  constructor(document) {
    this.document = document;
    this.fills = ["solid", "striped", "clear"];
    this.shapes = ["squiggle", "diamond", "pill"];
    this.colors = ["red", "purple", "green"];
    this.numbers = [1, 2, 3];

    this.generateCards();
  }

  generateCards() {
    let cardIndex = 1;
    this.fills.forEach(fill => this.shapes.forEach(shape => this.colors.forEach(color => this.numbers.forEach(number => {
      this.cards[cardIndex] = {
        imgIndex: cardIndex,
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

  randomTupleIndexes() {
    let result = [];
    let rand;
    while (result.length < 3) {
      rand = this.getRandomInt(1, 81);
      if (result.indexOf(rand) === -1) result.push(rand);
    }
    return result;
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

    console.log(result);

    // all attributes should be the same (length == 1) or different (length == 3)
    return !((result.fills.length === 2) || (result.colors.length === 2) || (result.shapes.length === 2) || (result.numbers.length === 2));
  }

  makeSet() {
    // method already ensures no duplicates
    let indexes = this.randomTupleIndexes(), cardA, cardB, cardC;

    cardA = this.cards[indexes[0]];
    cardB = this.cards[indexes[1]];
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
}
