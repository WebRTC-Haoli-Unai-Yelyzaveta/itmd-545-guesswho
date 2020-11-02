
//game part
//create a name array for tracking
const charNameArr = ["CHANTAL","ERIC","ALEX","BOB","PAUL","FRANK","ZOE","JOE","BUBA","RITA","RICK","ANTOINE","JOHN","CHAP","EVELYN","LADY","LILLIAN","JENNY","JAVIER","EVAN","MATHIAS","MICHAEL","HANK","VITO"];
//create gameboard
function generateGameboard() {


  const gameboard = document.getElementById('gameboard');
  //generate boxes for 24 characters
  for (let i = 0; i < charNameArr.length; i++) {
    const box = document.createElement('div');
    box.className = "board-item";
    const charImage = document.createElement('img');
    charImage.className = "board-item-image";
    //append image source from RoboHash API
    charImage.src = `https://robohash.org/${charNameArr[i]}?set=set4`;
    const charName = document.createElement('div');
    charName.className = "board-item-name";
    //add character's name
    const name = document.createTextNode(charNameArr[i]);
    charName.appendChild(name);
    box.appendChild(charImage);
    box.appendChild(charName);
    gameboard.appendChild(box);

  }

alert("Hello! Let me teach you how to play the game. You and the other player both have a hidden character. Ask the other player for clues in order to narrow down which character they have. As you narrow down your choices, click on the images to cross off possible characters.");

var k=Math.floor((Math.random() * 19) + 1);

const cat = document.createElement('div');
//cat.className = "board-item";
const charImage = document.createElement('img');
charImage.className = "board-item-image";
//append image source from RoboHash API
charImage.src = `https://robohash.org/${charNameArr[k]}?set=set4`;
const charName = document.createElement('div');
//charName.className = "board-item-name";
//add character's name
const name = document.createTextNode(charNameArr[k]);
//charName.appendChild(name);
cat.appendChild(charImage);
//cat.appendChild(charName);
gameboard.appendChild(cat);


  const t = document.createTextNode("You chosen character is "+ charNameArr[k]);
 document.body.appendChild(t);

}



generateGameboard();

//socket connection
var roomSocket = io('/' + NAMESPACE);
/*
var socket = io.connect("/");

socket.on('message', function(data){
  console.log('Connected...');
  socket.emit('connected', 'hello server!');
});
*/
roomSocket.on('message', data => {
  console.log('Message received: ' + data);

  //if (data == 'User successfully connected to the roomNamespace'){
  roomSocket.emit('connected', "Yeah I'm here");
  //}
});
