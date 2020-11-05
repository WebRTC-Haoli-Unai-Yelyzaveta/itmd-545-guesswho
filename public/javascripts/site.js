
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
var rtc_config = null;
const pc = new RTCPeerConnection(rtc_config);

//Variables for self video
const selfVideo = document.querySelector('#self-video');
var selfStream = new MediaStream();
selfVideo.Object = selfStream;

//Variables for remote video from the peer
const remoteVideo = document.querySelector('#remote-video');
var remoteStream = new MediaStream();
remoteVideo.Object = remoteStream;

var callButton = document.querySelector('#start-call');
const constraints = {video:true, audio:true}

var clientState = {
  makingOffer: false,
  polite: false,
  ignoringOffer: false
}

//Listen for 'message' event on the signaling channel
sigCh.on('message', data => {
  console.log(data);
});


//Listen for 'click' event on the #start-stream button
callButton.addEventListener('click', startCall);

function startCall() {
  console.log("I'm starting the call...");
  callButton.hidden = true;
  //ClientIs.polite = true;
  sigCh.emit('calling');
  startStream();
  startNegotiation();
}

sigCh.on('calling', function() {
  console.log("Someone is calling me!");
  callButton.innerText = "Answer Call";
  callButton.id = "answer";
  callButton.removeEventListener('click', startCall);
  callButton.addEventListener('click', function(){
    callButton.hidden = true;
    startStream();
    startNegotiation();
  });
});

async function startStream(){
  try{
    var stream = await navigator.mediaDevices.getUserMedia(constraints);
    for(var track of stream.getTracks()){
      pc.addTrack(track);
      //selfVideo.srcObject = selfStream.addTrack(track.track); --> Not working
      //selfVideo.srcObject = track.track; --> Not working
    }
    //TODO: Handle selfVideo with tracks
    selfVideo.srcObject = stream;
  }catch{
    console.log('Error');
  }
}

//Handle received tracks by the RTCPeerConnection channel
pc.ontrack = function(track) {
  remoteStream.addTrack(track.track);
}
/* HOW THEY DO IT IN THE PERFECT NEGOTIATION ARTICLE
pc.ontrack = ({track, streams}) => {
  track.onunmute = () => {
    if (remoteVideo.srcObject) {
      return;
    }
    remoteVideo.srcObject = streams[0];
  };
};
*/

async function startNegotiation() {
  pc.onnegotiationneeded = async () => {
    try {
      clientState.makingOffer = true;
      await pc.setLocalDescription();
      sigCh.emit('signal',{ description: pc.localDescription });
    } catch(err) {
      console.error(err);
    } finally {
      clientState.makingOffer = false;
    }
  }
}

sigCh.on('signal', receivedSignal);

async function receivedSignal({description, candidate}) {
  try{
    if(description) {
      console.log("I just received a description...");
      const offerCollision = (description.type == "offer") &&
                             (clientState.makingOffer || pc.signalingState != "stable");

      clientState.ignoringOffer = !clientState.polite && offerCollision;
      //Leave if client is ignoring offers
      if(clientState.ignoringOffer){
        return;
      }

      //Set the remote description
      await pc.setRemoteDescription(description);

      //send an answer if it's an offer
      if(description.type == "offer"){
        console.log("It was an offer! Let me answer...");
        await pc.setLocalDescription();
        sigCh.emit("signal", {description: pc.localDescription});
      }
    }else if(candidate){
      console.log('I just received a candidate...');
      console.log(candidate);
      await pc.addIceCandidate(candidate);
    }
  }catch(err){
    console.error(err);
  }
}
