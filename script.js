document.querySelector('input#yes').addEventListener('click', yes);
document.querySelector('input#no').addEventListener('click', no);

let cards = {};
let currentTuple = [];
generateCards();
loadTuple();

document.addEventListener('keypress', function (event) {
  switch (event.key) {
    case "y":
      yes();
      break;
    case "n":
      no();
      break;
  }
});

function yes() {
  if (tupleIsSet()) {
    right();
  } else {
    wrong();
  }
}

function no() {
  if (tupleIsSet()) {
    wrong();
  } else {
    right();
  }
}

function wrong() {
  document.querySelector("span#right").hidden = true;
  document.querySelector("span#wrong").hidden = false;
}

function right() {
  document.querySelector("span#right").hidden = false;
  document.querySelector("span#wrong").hidden = true;
  loadTuple();
}

function tupleIsSet() {
  // I'm sure there's a slicker way to do this, but this works
  let result = {
    fills: [],
    colors: [],
    shapes: [],
    numbers: []
  };

  currentTuple.forEach(card => {
    if (result.fills.indexOf(card.fill) === -1) result.fills.push(card.fill);
    if (result.colors.indexOf(card.color) === -1) result.colors.push(card.color);
    if (result.shapes.indexOf(card.shape) === -1) result.shapes.push(card.shape);
    if (result.numbers.indexOf(card.number) === -1) result.numbers.push(card.number);
  });

  // all attributes should be the same (length == 1) or different (length == 3)
  if ((result.fills.length === 2) || (result.colors.length === 2) || (result.shapes.length === 2) || (result.numbers.length === 2)) {
    return false;
  }

  return true;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomTupleIndexes() {
  let result = [];
  let rand;
  while (result.length < 3) {
    rand = getRandomInt(1, 81);
    if (result.indexOf(rand) === -1) result.push(rand);
  }
  return result;
}

function generateCards() {
  let fills = ["solid", "striped", "clear"];
  let shapes = ["squiggle", "diamond", "pill"];
  let colors = ["red", "purple", "green"];
  let numbers = [1, 2, 3];

  let cardIndex = 1;
  fills.forEach(fill => shapes.forEach(shape => colors.forEach(color => numbers.forEach(number => {
    cards[cardIndex] = {
      imgIndex: cardIndex,
      fill: fill,
      shape: shape,
      color: color,
      number: number
    };
    cardIndex++;
  }))));
}


function loadTuple() {
  let div = document.querySelector('#tuple'), indexes;
  while (div.firstChild) {
    div.removeChild(div.firstChild);
  }

  indexes = randomTupleIndexes();
  currentTuple = indexes.map(cardIndex => cards[cardIndex]);

  renderTuple(div);
}

function renderTuple(div) {
  currentTuple.forEach(card => {
    let img = document.createElement("img"), plural;
    img.src = `https://www.setgame.com/sites/all/modules/setgame_set/assets/images/new/${card.imgIndex}.png`;
    plural = card.number === 1 ? '' : 's';
    let cardDescription = `${card.number} ${card.color} ${card.fill} ${card.shape}${plural}`;
    img.alt = cardDescription;
    img.title = cardDescription;
    div.appendChild(img);
  });
}
