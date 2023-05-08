const button = document.querySelector('input');
button.addEventListener('click', loadTuple);
let cards = {};
generateCards();
loadTuple();

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

  indexes.forEach(cardIndex => {
    let card = cards[cardIndex];

    let img = document.createElement("img"), plural;
    img.src = `https://www.setgame.com/sites/all/modules/setgame_set/assets/images/new/${cardIndex}.png`;
    plural = card.number === 1 ? '' : 's';
    let cardDescription = `${card.number} ${card.color} ${card.fill} ${card.shape}${plural}`;
    img.alt = cardDescription;
    img.title = cardDescription;
    div.appendChild(img);
  });
}
