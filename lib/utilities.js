
function getRandomChars(length){
  var alphabet = "abcdefghijklmnopqrstuvwxyz";
  var lengthAlphabet = alphabet.length;
  var result = "";
  for (var i=0; i< length; i++){
    result+= alphabet[Math.floor(Math.random() * alphabet.length)]
  }
  return result;
}

function getRoom(){
  var room = getRandomChars(3) + "-" + getRandomChars(4) + "-" + getRandomChars(3);
  return room;
}
