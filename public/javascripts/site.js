var chosen;
var start;
var won;
const charNameArr = ["CHANTAL","ERIC","ALEX","BOB","PAUL","FRANK","ZOE","JOE","BUBA","RITA","RICK","ANTOINE","JOHN","CHAP","EVELYN","LADY","LILLIAN","JENNY","JAVIER","EVAN","MATHIAS","MICHAEL","HANK","VITO"];
//create gameboard
function generateGameboard() {
    var firstTime = true;

  const gameboard = document.getElementById('gameboard');
  //generate boxes for 24 characters
  for (let i = 0; i < charNameArr.length; i++) {
    const box = document.createElement('div');
    box.className = "board-item";
    box.id = "boarditemremove"; // Set the id
  //  id.className = "boardremove";
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


    box.addEventListener("click", function (){
      if (firstTime){
          firstTime = false;
          chosen= charNameArr[i];
    document.getElementById("y").style.display = "block";
              document.getElementById("y").src=`https://robohash.org/${charNameArr[i]}?set=set4`;
              document.getElementById("y").style.display = "block";
              document.getElementById("name").innerHTML = chosen;
              var str=1;
              start=2;
              opponent();
      }
     if(str==1)
     {
       charImage.src =`https://robohash.org/${charNameArr[i]}?set=set4`;
     }
     else

      charImage.src = "https://upload.wikimedia.org/wikipedia/commons/0/04/X-black-white-border.svg";
      console.log(i);
      var index= i;
      setIndex(index);
    });
  }
}


var cardclicked;

function setIndex(index){
  cardclicked= index;
  console.log("cardcliked=" + cardclicked);
};


generateGameboard();

//socket connection to the signaling channel
//between both peers

const sigCh = io('/' + NAMESPACE);
var rtc_config = null;
const pc = new RTCPeerConnection(rtc_config);

// Set the placeholder for the data channel
var dc = null;
var gdc= null;
// Track client states
var clientState = {
  makingOffer: false,
  polite: false,
  ignoringOffer: false
}

// Add DOM elements for the data channel
const chatArea = document.querySelector('.chat-area');
const chatForm = document.querySelector('.chat-form');
const chatInput = document.querySelector('#chat-input');
const chatBtn = document.querySelector('#chat-btn');
const chatPopUp = document.querySelector('#chat-popup');
const chatBox = document.querySelector('#togglechat');
var gameBoardSelect =  document.getElementById("game")

var done = false;

pc.onicecandidate = ({candidate}) => {
  sigCh.emit('signal', {candidate:candidate});
}

var chatBoxState = {

  hidden: true
}
chatPopUp.addEventListener('click', function(event){
  console.log("Someone click the chat button!");
  //var chatBox = document.getElementById('#togglechat.chat-container');
  if(chatBoxState.hidden){ //if the chatbox is hidden
    //chatBox.hidden=false; //we display it
    document.getElementById("togglechat").style.display = "block";
    chatPopUp.innerText = "Hide Chat"
    chatBoxState.hidden=false;
  }else if(chatBoxState.hidden == false){
    //chatBox.hidden = true;
    document.getElementById("togglechat").style.display = "none";
    chatBoxState.hidden=true;
    chatPopUp.innerText = "Show Chat";
  }
});
// A function to append message to the chat box chat box area
function appendMsgToChatArea(area, msg, who) {
  console.log('somebody sent message', msg)
  var li = document.createElement('li');
  var msg = document.createTextNode(msg);
  li.className = who;
  li.appendChild(msg);
  area.appendChild(li);
}

var opponentcard;

// A function to listen for the data channel event
function addDataChannelEventListener(datachannel) {
  datachannel.onmessage = (e) => {
    appendMsgToChatArea(chatArea, e.data, 'peer');
  }

  datachannel.onopen = () => {
    chatInput.disabled = false;
    chatBtn.disabled = false;
  }

  datachannel.onclose = () => {
    chatInput.disabled = true;
    chatBtn.disabled = true;
  }

  // Send chat messages from the self side
  chatForm.addEventListener('submit', function(e) {
    e.preventDefault();
    var msg = chatInput.value;
    appendMsgToChatArea(chatArea, msg, 'self');
    datachannel.send(msg);
    chatInput.value = '';
  })
}

// the polite client will open the data channel once the connection state become 'connected'
pc.onconnectionstatechange = (e) => {
  if(pc.connectionState == 'connected') {
    if (clientState.polite) {
      console.log('data channel starts');
      dc = pc.createDataChannel('text chat');
      gdc = pc.createDataChannel('game data');
      addDataChannelEventListener(dc);
      var g = new GameDataChannelEventListener(gdc)
    }
  }
}

// Listen for the data channel on the peer side
pc.ondatachannel = (e) => {
  if (e.channel.label == 'text chat') {
    dc = e.channel;
    addDataChannelEventListener(dc);
  }
    // Data channels can be distinguished by e.channel.label
    // which would be `text chat` in this case. Use that to
    // decide what to do with the channel that has opened
    if (e.channel.label == 'game data') {
      console.log('something happend in game channel')
      var g = new GameDataChannelEventListener(e.channel)
    }

}

function GameDataChannelEventListener(gamedata) {

  gamedata.onmessage = (e) => {
    opponentcard=e.data;
    console.log(opponentcard);
    flip(opponentcard);
  //  appendMsgToChatArea(chatArea, e.data ,'peer');
  }


  //^send whatever you click on in ther
  // Send chat messages from the self side
  gameBoardSelect.addEventListener('click', function(e) {
        e.preventDefault();
        var msg = cardclicked + " " +chosen;
        if(won==="end"){
          msg = "end"
        }
      //  appendMsgToChatArea(chatArea, msg, 'self');
       gamedata.send(msg);
      //  chatInput.value = '';
})

}

// Variable for checking video
const checkedVideo = document.querySelector('#checked-video');
//Variables for self video
const selfVideo = document.querySelector('#self-video');
var selfStream = new MediaStream();
selfVideo.srcObject = selfStream;

//Variables for remote video from the peer
const remoteVideo = document.querySelector('#remote-video');
var remoteStream = new MediaStream();
remoteVideo.srcObject = remoteStream;

const callButton = document.querySelector('#start-call');
const checkMediaButton = document.querySelector('#check-media');

const constraints = {video:true, audio:true}


//Listen for 'message' event on the signaling channel
sigCh.on('message', data => {
  console.log(data);
});


//Listen for 'click' event on the #start-stream button
callButton.addEventListener('click', startCall);
checkMediaButton.addEventListener('click', checkMedia);

function alerttest(x){
  console.log("card selected");
    console.log("x");

}
function startCall() {
  console.log("I'm starting the call...");
  callButton.hidden = true;
  checkMediaButton.hidden = true;
  clientState.polite = true;
  chatPopUp.style.display = "block";
  sigCh.emit('game-on');
  showGame();
  startStream();
  startNegotiation();
}

function opponent(){

  alert("Hello! Let me teach you how to play the game. You and the other player both have a hidden character. Ask the other player for clues in order to narrow down which character they have. As you narrow down your choices, click on the images to cross off possible characters.");
  document.getElementById("game").style.display = "inline-flex";
  document.getElementById("gameboard2").style.display = "grid";
  document.getElementById("choose").style.display = "none";
  document.querySelector('.pickedcard').style.display = "block";
  document.querySelector('#guess').style.display = "block";
  document.getElementById("introduction").style.display = "block";
  console.log("Your opponents board is now being generated");
  document.getElementById("remote-video").style.display = "block";
  document.getElementById("self-video").style.display = "block";
  //chatPopUp.style.display = "block";


  for (var i = 0; i < 24; i++) {

  var uniqid = "i"+ i;
  var img = document.createElement("img");
  img.id= uniqid;
  img.src = "https://i1.wp.com/cornellsun.com/wp-content/uploads/2020/06/1591119073-screen_shot_2020-06-02_at_10.30.13_am.png?fit=700%2C652";
  var src = document.getElementById("gameboard2");
  src.appendChild(img);


  }
}

var opponentschosen;
function flip(message){

if(message==="end"){
  alert("Your opponent won!");

  var myobj = document.getElementById("gameboard");
   myobj.remove();

   var myobj2 = document.getElementById("peercontain");
    myobj2.remove();

    var myobj3 = document.getElementById("guesscontain");
     myobj3.remove();

     var myobj4 = document.getElementById("choose");
      myobj4.remove();
}
var cardnumber=  message.substr(0,message.indexOf(" ")); // "72"
opponentschosen =  message.substr(message.indexOf(" ")+1); // "tocirah sneab"


  // = message.replace(/\D/g, "");
// message.match(/\d+/g);
console.log(opponentschosen);
  for (var i = 0; i < 24; i++) {
//  var idtag = str.substring(0);
  //console.log(idtag);

  if(i==cardnumber){
    var revert= "i"+i;
     document.getElementById(revert).src = "https://upload.wikimedia.org/wikipedia/commons/0/04/X-black-white-border.svg";
   }
}
}

  document.getElementById("guess").addEventListener("click", function() {
    document.getElementById("sub").style.display = "block";
      document.getElementById("subtext").style.display = "block";
      });

      document.getElementById("sub").addEventListener("click", function() {
        var myguess= document.getElementById("subtext").value;
    console.log("my guess " +myguess);
        if(myguess === opponentschosen){
          alert("Congrats, you won!");
          won= "end";
      //    document.getElementById("gameboard").contentWindow.location.reload(true);
        var myobj = document.getElementById("gameboard");
         myobj.remove();

         var myobj2 = document.getElementById("peercontain");
          myobj2.remove();

          var myobj3 = document.getElementById("guesscontain");
           myobj3.remove();

           var myobj4 = document.getElementById("choose");
            myobj4.remove();
        }
        else alert("Sorry...that's incorrect");
      });


function showGame() {
  console.log("the join game button has been clicked..");
  console.log("Showing the gameboard...");
  // Show the game board
  document.querySelector("body").style.display = "grid";
  document.getElementById("choose").style.display = "block";
  document.getElementById("game").style.display = "flex";
  document.getElementById("gameboard").style.display = "inline-grid";
  // Show the chat box
  // TODO: show the chat button instead
  document.getElementById("togglechat").style.display = "none";
  //document.getElementById("#chat-popup").style.display = "block";
  // Show the video elements
  document.querySelector("#content").style.display = "block";
  // Hide the elements in the waiting room
  document.querySelector(".checked-media-container").style.display = "none";
}

sigCh.on('game-on', function() {
  console.log("Someone is calling me!");
  console.log("Someone just joined the game room");
  // Update the room status by showing the message
  const roomStatusMsg = document.querySelector("#room-status-msg");
  roomStatusMsg.innerText = "There is 1 person in the game room";
  chatPopUp.style.display = "block";
  callButton.removeEventListener('click', startCall);
  callButton.addEventListener('click', function(){
    callButton.hidden = true;
    checkMediaButton.removeEventListener('click', checkMedia);
    checkMediaButton.hidden = true;
    showGame();
    startStream();
    startNegotiation();
  });
});

async function checkMedia(){
  try{
    var stream = await navigator.mediaDevices.getUserMedia(constraints);
    checkedVideo.srcObject = stream;
    selfVideo.srcObject = stream;
  }catch{
    console.log('Error');
  }
}

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
  console.log("RECEIVED TRACK!");
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
      console.log('making an offer...');
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

sigCh.on('signal', async function({description, candidate}) {
  try{
    if(description) {
      //console.log("I just received a description...");
      const offerCollision = (description.type == 'offer') &&
                             (clientState.makingOffer || pc.signalingState != "stable");

      clientState.ignoringOffer = !clientState.polite && offerCollision;
      //Leave if client is ignoring offers
      if(clientState.ignoringOffer){
        return;
      }

      //Set the remote description
      await pc.setRemoteDescription(description);

      //send an answer if it's an offer
      if(description.type == 'offer'){
        console.log("It was an offer! Let me answer...");
        await pc.setLocalDescription();
        sigCh.emit('signal', {description: pc.localDescription});
      }
    }else if(candidate){
    //  console.log('I just received a candidate...');
      //console.log(candidate);
      await pc.addIceCandidate(candidate);
    }
  }catch(err){
    console.error(err);
  }
});
/*
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
*/

//Logic to send candidate
