
function getRandomChars(length){
  var alphabet = "abcdefghijklmnopqrstuvwxyz";
  var lengthAlphabet = alphabet.length;
  var result = "";
  for (var i=0; i< length; i++){
    result+= alphabet[Math.floor(Math.random() * alphabet.length)]
  }
  return result;
}

function getRoom(...segments){
  var room = getRandomChars(segments[0]) + "-" + getRandomChars(segments[1]) + "-" + getRandomChars(segments[2]);
  return room;
}

//
module.exports = {getRoom};
