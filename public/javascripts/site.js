
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

}


generateGameboard();

//socket connection to the signaling channel
//between both peers
const sigCh = io('/' + NAMESPACE);
var config = null;
const pc = new RTCPeerConnection(config);

//Vatiables for self video
const selfVideo = document.querySelector('#self-video');
var selfStream = new MediaStream();
selfVideo.Object = selfStream;

//Vatiables for remote video from the peer
const remoteVideo = document.querySelector('#remote-video');
var remoteStream = new MediaStream();
remoteVideo.Object = remoteStream;

var streamButton = document.querySelector('#start-stream');
const constraints = {video:true, audio:true}

//Listen for 'message' event on the signaling channel
sigCh.on('message', data => {
  console.log(data);
});


//Listen for 'click' event on the #start-stream button
streamButton.addEventListener('click', function(e) {
  startStream();
});





async function startStream(){
  try{
    var stream = await navigator.mediaDevices.getUserMedia(constraints);
    for(var track of stream.getTracks()){
      pc.addTrack(track);

    }
    //TODO: Handle selfVideo with tracks
    selfVideo.srcObject = stream;
  }catch{
    console.log('Error');
  }

}
