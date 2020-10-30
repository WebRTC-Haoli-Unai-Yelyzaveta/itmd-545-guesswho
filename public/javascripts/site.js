//game part
//create gameboard
function generateGameboard() {
  const gameboard = document.getElementById('gameboard');
  //generate boxes for 24 characters
  for (let i = 1; i <= 24; i++) {
    const box = document.createElement('div');
    box.className = "board-item";
    const charImage = document.createElement('img');
    charImage.className = "board-item-image";
    //append image source from RoboHash API
    charImage.src = `https://robohash.org/${i}?set=set4`;
    const charName = document.createElement('div');
    charName.className = "board-item-name";
    //add character's name
    const name = document.createTextNode(i);
    charName.appendChild(name);
    box.appendChild(charImage);
    box.appendChild(charName);
    gameboard.appendChild(box);
  }
}

generateGameboard();
