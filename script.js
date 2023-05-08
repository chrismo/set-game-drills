console.log('Hello!');

const button = document.querySelector('input');
button.addEventListener('click', loadTuple);

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function loadTuple() {
  let div = document.querySelector('#tuple');
  while (div.firstChild) {
    div.removeChild(div.firstChild);
  }

  for (var i = 0; i < 3; i++) {
    let a = getRandomInt(1, 81);
  
    let imgA = document.createElement("img");
    imgA.src = `https://www.setgame.com/sites/all/modules/setgame_set/assets/images/new/${a}.png`;
  
    div.appendChild(imgA);
  }

}
